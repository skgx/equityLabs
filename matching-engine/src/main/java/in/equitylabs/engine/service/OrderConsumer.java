package in.equitylabs.engine.service;

import in.equitylabs.engine.MatchEngine;
import in.equitylabs.engine.model.Order;
import in.equitylabs.engine.model.Trade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Step 3.3.2: The OrderConsumer acts as the entry point for the Matching Engine.
 * It listens to Kafka, triggers the engine, and sends results back.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderConsumer {

    private final MatchEngine matchEngine;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * 1. Listen: This method wakes up whenever a new order arrives in 'orders-in'.
     */
    @KafkaListener(topics = "orders-in", groupId = "matching-engine-group")
    public void consumeOrder(Order order) {
        log.info("RECEIVED ORDER: ID={} | SYMBOL={} | QTY={}", order.getOrderId(), order.getSymbol(), order.getQuantity());
        
        try {
            // 2. Process: Feed the order into our Price-Time Priority Matching Engine.
            // This returns a list of trades (matches) that occurred.
            List<Trade> trades = matchEngine.processOrder(order);
            
            // 3. Loop: If matches were found, we must broadcast them back to the rest of the system.
            if (!trades.isEmpty()) {
                log.info("MATCH SUCCESS: Order {} resulted in {} trades", order.getOrderId(), trades.size());
                
                for (Trade trade : trades) {
                    // Send each trade to the 'trades-out' topic.
                    // The Order-Service and the WebSocket-Service will be listening there.
                    kafkaTemplate.send("trades-out", trade.getTradeId(), trade);
                }
            } else {
                log.info("NO MATCH: Order {} added to book (waiting for counterparty)", order.getOrderId());
            }
        } catch (Exception e) {
            log.error("CRITICAL ERROR processing order {}: {}", order.getOrderId(), e.getMessage());
            // In a production system, we would send this to an 'error' topic or DLQ
        }
    }
}
