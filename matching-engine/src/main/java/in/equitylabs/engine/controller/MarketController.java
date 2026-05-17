package in.equitylabs.engine.controller;

import in.equitylabs.engine.MatchEngine;
import in.equitylabs.engine.OrderBook;
import in.equitylabs.engine.model.Order;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarketController {

    private final MatchEngine matchEngine;

    @GetMapping("/{symbol}/orderbook")
    public Mono<ResponseEntity<OrderBookResponse>> getOrderBook(@PathVariable String symbol) {
        return Mono.just(
                matchEngine.getOrderBook(symbol)
                        .map(book -> ResponseEntity.ok(convertToResponse(book)))
                        .orElseGet(() -> {
                            log.info("Order book for symbol {} is currently empty", symbol);
                            return ResponseEntity.ok(OrderBookResponse.builder()
                                    .symbol(symbol)
                                    .bids(Collections.emptyList())
                                    .asks(Collections.emptyList())
                                    .build());
                        })
        );
    }

    private OrderBookResponse convertToResponse(OrderBook book) {
        return OrderBookResponse.builder()
                .symbol(book.getSymbol())
                .bids(book.getBids().stream()
                        .map(o -> new OrderEntry(o.getPrice(), o.getRemainingQty()))
                        .collect(Collectors.toList()))
                .asks(book.getAsks().stream()
                        .map(o -> new OrderEntry(o.getPrice(), o.getRemainingQty()))
                        .collect(Collectors.toList()))
                .build();
    }

    @Data
    @Builder
    public static class OrderBookResponse {
        private String symbol;
        private List<OrderEntry> bids;
        private List<OrderEntry> asks;
    }

    @Data
    public static class OrderEntry {
        private BigDecimal price;
        private Integer quantity;

        public OrderEntry(BigDecimal price, Integer quantity) {
            this.price = price;
            this.quantity = quantity;
        }
    }
}
