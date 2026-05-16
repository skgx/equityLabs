package in.equitylabs.orders.controller;

import in.equitylabs.orders.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/market-proxy")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarketDataController {

    private final MarketDataService marketDataService;

    @GetMapping("/chart/{symbol}")
    public Mono<String> getChartData(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "1mo") String range,
            @RequestParam(defaultValue = "1d") String interval) {
        return marketDataService.getChartData(symbol, range, interval);
    }
}
