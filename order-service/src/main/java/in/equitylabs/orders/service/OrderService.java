package in.equitylabs.orders.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.equitylabs.orders.dto.OrderRequest;
import in.equitylabs.orders.dto.OrderResponse;
import in.equitylabs.orders.model.Order;
import in.equitylabs.orders.model.OutboxEvent;
import in.equitylabs.orders.repository.OrderRepository;
import in.equitylabs.orders.repository.OutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    public Mono<OrderResponse> createOrder(OrderRequest request) {
        String orderId = UUID.randomUUID().toString();
        log.info("CREATING ORDER: ID={} | SYMBOL={} | QTY={}", orderId, request.getSymbol(), request.getQuantity());

        Order order = Order.builder()
                .orderId(orderId)
                .userId(request.getUserId())
                .symbol(request.getSymbol())
                .quantity(request.getQuantity())
                .remainingQty(request.getQuantity())
                .price(request.getPrice())
                .orderType(request.getOrderType())
                .orderCategory(request.getOrderCategory())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .isNew(true)
                .build();

        return orderRepository.save(order)
                .doOnSuccess(saved -> log.info("Order saved to DB: {}", saved.getOrderId()))
                .doOnError(e -> log.error("ERROR SAVING ORDER: {}", e.getMessage()))
                .flatMap(savedOrder -> {
                    try {
                        String payload = objectMapper.writeValueAsString(savedOrder);
                        OutboxEvent event = OutboxEvent.builder()
                                .aggregateId(savedOrder.getOrderId())
                                .aggregateType("ORDER")
                                .payload(payload)
                                .status("PENDING")
                                .createdAt(LocalDateTime.now())
                                .build();
                        
                        return outboxRepository.save(event)
                                .doOnSuccess(e -> log.info("Outbox event saved: {}", e.getId()))
                                .doOnError(e -> log.error("ERROR SAVING OUTBOX: {}", e.getMessage()));
                    } catch (JsonProcessingException e) {
                        return Mono.error(new RuntimeException("Failed to serialize order", e));
                    }
                })
                .map(event -> OrderResponse.builder()
                        .orderId(orderId)
                        .status("ACCEPTED")
                        .message("Order accepted and queued for processing")
                        .build())
                .onErrorResume(e -> {
                    log.error("CRITICAL ORDER ERROR: {}", e.getMessage());
                    return Mono.just(OrderResponse.builder()
                            .orderId(orderId)
                            .status("FAILED")
                            .message("Failed to process order: " + e.getMessage())
                            .build());
                });
    }

    public Flux<Order> getOrdersByUser(String userId) {
        log.info("Fetching orders for user: {}", userId);
        return orderRepository.findByUserId(userId);
    }
}
