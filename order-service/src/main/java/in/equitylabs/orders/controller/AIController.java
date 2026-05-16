package in.equitylabs.orders.controller;

import in.equitylabs.orders.ai.GeminiService;
import in.equitylabs.orders.dto.ExplainOrderRequest;
import in.equitylabs.orders.dto.ExplainOrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final GeminiService geminiService;

    @PostMapping("/explain-order")
    public Mono<ExplainOrderResponse> explainOrder(@RequestBody ExplainOrderRequest req) {
        // Stub bestBid/bestAsk to 0 for now until MarketDataService is fully implemented
        return geminiService.explainOrder(
                req.getSymbol(), req.getQuantity(), req.getPrice(),
                req.getOrderType(), req.getOrderCategory(),
                0.0, 0.0
        ).map(explanation -> new ExplainOrderResponse(req.getSymbol(), explanation));
    }

    @GetMapping("/market-summary/{symbol}")
    public Mono<String> getMarketSummary(@PathVariable String symbol) {
        // Stub metrics for now
        return geminiService.generateMarketSummary(
                symbol, 1000, 450, 0.65, 150.50, 1.2
        );
    }

    @GetMapping("/suggest-price/{symbol}/{side}")
    public Mono<String> suggestPrice(@PathVariable String symbol, @PathVariable String side) {
        // Stub bestBid/bestAsk for now
        return geminiService.suggestPrice(symbol, side, 150.00, 151.00, 0.75);
    }
}
