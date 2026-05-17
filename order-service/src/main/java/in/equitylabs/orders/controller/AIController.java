package in.equitylabs.orders.controller;

import in.equitylabs.orders.ai.GeminiService;
import in.equitylabs.orders.dto.ExplainOrderRequest;
import in.equitylabs.orders.dto.ExplainOrderResponse;
import in.equitylabs.orders.repository.OrderRepository;
import in.equitylabs.orders.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final GeminiService geminiService;
    private final OrderRepository orderRepository;
    private final MarketDataService marketDataService;

    @PostMapping("/explain-order")
    public Mono<ExplainOrderResponse> explainOrder(@RequestBody ExplainOrderRequest req) {
        // Fetch real context: user orders and market sentiment
        return orderRepository.findBySymbol(req.getSymbol())
                .take(10)
                .collectList()
                .onErrorResume(e -> {
                    log.warn("Failed to fetch order history for AI context: {}", e.getMessage());
                    return Mono.just(java.util.Collections.emptyList());
                })
                .flatMap(recentOrders -> {
                    String orderHistory = recentOrders.stream()
                            .map(o -> String.format("%s %d @ %.2f (%s)", o.getOrderType(), o.getQuantity(), o.getPrice(), o.getStatus()))
                            .collect(Collectors.joining(", "));

                    if (orderHistory.isEmpty()) orderHistory = "No recent history available";

                    return geminiService.explainOrder(
                            req.getSymbol(), req.getQuantity(), req.getPrice(),
                            req.getOrderType(), req.getOrderCategory(),
                            orderHistory
                    ).map(explanation -> new ExplainOrderResponse(req.getSymbol(), explanation));
                });
    }

    @GetMapping("/market-summary/{symbol}")
    public Mono<String> getMarketSummary(@PathVariable String symbol) {
        return marketDataService.getChartData(symbol, "1d", "15m")
                .flatMap(chartData -> geminiService.generateMarketSummary(symbol, chartData));
    }

    @GetMapping("/suggest-price/{symbol}/{side}")
    public Mono<String> suggestPrice(@PathVariable String symbol, @PathVariable String side) {
        return marketDataService.getChartData(symbol, "1d", "1m")
                .flatMap(chartData -> geminiService.suggestPrice(symbol, side, chartData));
    }
}
