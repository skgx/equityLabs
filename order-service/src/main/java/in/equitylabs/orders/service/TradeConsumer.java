package in.equitylabs.orders.service;

import in.equitylabs.orders.ai.GeminiService;
import in.equitylabs.orders.model.Trade;
import in.equitylabs.orders.repository.OrderRepository;
import in.equitylabs.orders.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class TradeConsumer {

    private final TradeRepository tradeRepository;
    private final OrderRepository orderRepository;
    private final GeminiService geminiService;
    private final TradeStreamHandler tradeStreamHandler;

    @KafkaListener(topics = "trades-out", groupId = "order-service-group")
    public void consumeTrade(Trade trade) {
        log.info("TRADE RECEIVED FROM KAFKA: ID={} | SYMBOL={} | PRICE={} | QTY={}", 
                trade.getTradeId(), trade.getSymbol(), trade.getExecutedPrice(), trade.getQuantity());

        // Broadcast trade for the trade feed (Chart)
        tradeStreamHandler.broadcastTrade(trade);

        // Process trade updates and broadcast order fill notifications
        processTrade(trade)
                .doOnError(e -> log.error("Error processing trade {}: {}", trade.getTradeId(), e.getMessage()))
                .subscribe();
    }

    @Transactional
    public Mono<Void> processTrade(Trade trade) {
        log.info("Processing trade matches for orders: BUY={} SELL={}", trade.getBuyOrderId(), trade.getSellOrderId());
        
        return tradeRepository.save(trade)
                .then(updateOrder(trade.getBuyOrderId(), trade.getQuantity()))
                .then(updateOrder(trade.getSellOrderId(), trade.getQuantity()))
                .then(geminiService.analyzeTradeAnomaly(
                        trade.getSymbol(), 
                        trade.getExecutedPrice().doubleValue(), 
                        trade.getExecutedPrice().doubleValue(), 
                        trade.getQuantity(), 
                        trade.getQuantity()
                ).doOnNext(anomaly -> log.info("AI Trade Analysis for {}: {}", trade.getSymbol(), anomaly)))
                .then();
    }

    private Mono<Void> updateOrder(String orderId, Integer filledQty) {
        if (orderId == null) return Mono.empty();
        
        return orderRepository.findById(orderId)
                .flatMap(order -> {
                    int oldRemaining = order.getRemainingQty();
                    int newRemaining = Math.max(0, oldRemaining - filledQty);
                    order.setRemainingQty(newRemaining);
                    order.setStatus(newRemaining == 0 ? "FILLED" : "PARTIALLY_FILLED");
                    order.setNew(false);
                    
                    log.info("ORDER UPDATE: ID={} | STATUS={} | REMAINING={}", orderId, order.getStatus(), newRemaining);
                    
                    return orderRepository.save(order)
                            .doOnNext(saved -> {
                                log.info("BROADCASTING ORDER UPDATE: ID={} status={}", saved.getOrderId(), saved.getStatus());
                                tradeStreamHandler.broadcastOrderUpdate(saved);
                            });
                })
                .switchIfEmpty(Mono.fromRunnable(() -> log.warn("Order not found in DB: {}", orderId)))
                .then();
    }
}
