package in.equitylabs.engine.controller;

import in.equitylabs.engine.MatchEngine;
import in.equitylabs.engine.OrderBook;
import in.equitylabs.engine.model.Order;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

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
                        .orElse(ResponseEntity.notFound().build())
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
