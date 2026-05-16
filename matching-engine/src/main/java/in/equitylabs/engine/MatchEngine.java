package in.equitylabs.engine;

import in.equitylabs.engine.model.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchEngine {
    // Map of Symbol -> OrderBook
    private final Map<String, OrderBook> orderBooks = new ConcurrentHashMap<>();
    private final ReactiveRedisTemplate<String, Order> redisTemplate;

    private static final String REDIS_KEY_PREFIX = "orderbook:";

    @PostConstruct
    public void init() {
        log.info("Initializing MatchEngine: Loading resting orders from Redis...");
        redisTemplate.keys(REDIS_KEY_PREFIX + "*")
                .flatMap(redisTemplate.opsForValue()::get)
                .doOnNext(order -> {
                    OrderBook book = orderBooks.computeIfAbsent(order.getSymbol(), OrderBook::new);
                    book.addOrder(order);
                    log.debug("Restored order {} for symbol {}", order.getOrderId(), order.getSymbol());
                })
                .doOnComplete(() -> log.info("MatchEngine initialization complete."))
                .subscribe();
    }

    public List<Trade> processOrder(Order order) {
        OrderBook book = orderBooks.computeIfAbsent(order.getSymbol(), OrderBook::new);
        List<Trade> trades = new ArrayList<>();

        if (order.getOrderType() == OrderType.BUY) {
            matchOrder(order, book.getAsks(), trades);
        } else {
            matchOrder(order, book.getBids(), trades);
        }

        // If order is not fully filled and it's a LIMIT order, add to book and persist
        if (order.getRemainingQty() > 0 && order.getOrderCategory() == OrderCategory.LIMIT) {
            book.addOrder(order);
            persistOrder(order);
            log.info("Order {} added to book. Remaining Qty: {}", order.getOrderId(), order.getRemainingQty());
        } else if (order.getRemainingQty() > 0 && order.getOrderCategory() == OrderCategory.MARKET) {
            log.info("Market order {} expired with {} unfilled units (no liquidity)", order.getOrderId(), order.getRemainingQty());
        }

        return trades;
    }

    private void matchOrder(Order incomingOrder, PriorityQueue<Order> oppositeSide, List<Trade> trades) {
        while (!oppositeSide.isEmpty() && incomingOrder.getRemainingQty() > 0) {
            Order bestOppositeOrder = oppositeSide.peek();

            if (!canMatch(incomingOrder, bestOppositeOrder)) {
                break;
            }

            // Execute Trade
            int matchQty = Math.min(incomingOrder.getRemainingQty(), bestOppositeOrder.getRemainingQty());
            
            incomingOrder.setRemainingQty(incomingOrder.getRemainingQty() - matchQty);
            bestOppositeOrder.setRemainingQty(bestOppositeOrder.getRemainingQty() - matchQty);

            Trade trade = Trade.builder()
                    .tradeId(UUID.randomUUID().toString())
                    .symbol(incomingOrder.getSymbol())
                    .buyOrderId(incomingOrder.getOrderType() == OrderType.BUY ? incomingOrder.getOrderId() : bestOppositeOrder.getOrderId())
                    .sellOrderId(incomingOrder.getOrderType() == OrderType.SELL ? incomingOrder.getOrderId() : bestOppositeOrder.getOrderId())
                    .buyUserId(incomingOrder.getOrderType() == OrderType.BUY ? incomingOrder.getUserId() : bestOppositeOrder.getUserId())
                    .sellUserId(incomingOrder.getOrderType() == OrderType.SELL ? incomingOrder.getUserId() : bestOppositeOrder.getUserId())
                    .executedPrice(bestOppositeOrder.getPrice()) // Price-time priority: Match at the price of the resting order
                    .quantity(matchQty)
                    .tradedAt(LocalDateTime.now())
                    .build();

            trades.add(trade);
            log.info("MATCH! Trade executed: {} units at {}", matchQty, trade.getExecutedPrice());

            if (bestOppositeOrder.getRemainingQty() == 0) {
                oppositeSide.poll(); // Remove fully filled order from book
                removeOrderFromRedis(bestOppositeOrder.getOrderId());
            } else {
                // Update resting order in Redis with new remaining quantity
                persistOrder(bestOppositeOrder);
            }
        }
    }

    private boolean canMatch(Order incoming, Order resting) {
        if (incoming.getOrderCategory() == OrderCategory.MARKET) {
            return true; // Market orders match any price
        }
        
        if (incoming.getOrderType() == OrderType.BUY) {
            // Buyer's max price must be >= Seller's min price
            return incoming.getPrice().compareTo(resting.getPrice()) >= 0;
        } else {
            // Seller's min price must be <= Buyer's max price
            return incoming.getPrice().compareTo(resting.getPrice()) <= 0;
        }
    }

    private void persistOrder(Order order) {
        redisTemplate.opsForValue().set(REDIS_KEY_PREFIX + order.getOrderId(), order)
                .subscribe();
    }

    private void removeOrderFromRedis(String orderId) {
        redisTemplate.opsForValue().delete(REDIS_KEY_PREFIX + orderId)
                .subscribe();
    }

    public void cancelOrder(String symbol, String orderId) {
        OrderBook book = orderBooks.get(symbol);
        if (book != null) {
            boolean removed = book.getBids().removeIf(o -> o.getOrderId().equals(orderId));
            if (!removed) {
                removed = book.getAsks().removeIf(o -> o.getOrderId().equals(orderId));
            }
            
            if (removed) {
                log.info("Order {} cancelled and removed from book.", orderId);
                removeOrderFromRedis(orderId);
            } else {
                log.warn("Cancel requested for order {}, but it was not found in the book.", orderId);
            }
        }
    }

    public Optional<OrderBook> getOrderBook(String symbol) {
        return Optional.ofNullable(orderBooks.get(symbol));
    }
}
