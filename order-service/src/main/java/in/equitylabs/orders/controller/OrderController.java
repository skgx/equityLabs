package in.equitylabs.orders.controller;

import in.equitylabs.orders.dto.OrderRequest;
import in.equitylabs.orders.dto.OrderResponse;
import in.equitylabs.orders.model.Order;
import in.equitylabs.orders.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public Mono<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        log.info("REST request to create order: {}", request);
        return orderService.createOrder(request);
    }

    @GetMapping("/user/{userId}")
    public Flux<Order> getOrdersByUser(@PathVariable String userId) {
        return orderService.getOrdersByUser(userId);
    }
}
