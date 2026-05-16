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
        log.info("TRADE RECEIVED: ID={} | SYMBOL={} | PRICE={} | QTY={}", 
                trade.getTradeId(), trade.getSymbol(), trade.getExecutedPrice(), trade.getQuantity());

        // Broadcast to UI via WebSocket
        tradeStreamHandler.broadcastTrade(trade);

        // We use .subscribe() because Kafka listeners are not blocking/awaiting the reactive flow
        processTrade(trade).subscribe();
    }

    @Transactional
    public Mono<Void> processTrade(Trade trade) {
        // 1. Save the trade for historical records
        return tradeRepository.save(trade)
                .then(updateOrder(trade.getBuyOrderId(), trade.getQuantity()))
                .then(updateOrder(trade.getSellOrderId(), trade.getQuantity()))
                .then(geminiService.analyzeTradeAnomaly(
                        trade.getSymbol(), 
                        trade.getExecutedPrice().doubleValue(), 
                        trade.getExecutedPrice().doubleValue(), // Stub avg price
                        trade.getQuantity(), 
                        trade.getQuantity() // Stub avg qty
                ).doOnNext(anomaly -> log.info("AI Trade Analysis: {}", anomaly)))
                .then();
    }

    private Mono<Void> updateOrder(String orderId, Integer filledQty) {
        return orderRepository.findById(orderId)
                .flatMap(order -> {
                    int newRemaining = order.getRemainingQty() - filledQty;
                    order.setRemainingQty(newRemaining);
                    order.setStatus(newRemaining == 0 ? "FILLED" : "PARTIALLY_FILLED");
                    order.setNew(false);
                    
                    log.info("Updating order {}: status={}, remainingQty={}", orderId, order.getStatus(), newRemaining);
                    return orderRepository.save(order);
                })
                .then();
    }
}
