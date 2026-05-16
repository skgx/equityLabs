package in.equitylabs.orders.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@Slf4j
@RequiredArgsConstructor
public class MarketDataService {

    private final WebClient.Builder webClientBuilder;
    private final String YAHOO_BASE_URL = "https://query2.finance.yahoo.com/v8/finance/chart/";

    public Mono<String> getChartData(String symbol, String range, String interval) {
        String url = YAHOO_BASE_URL + symbol + "?range=" + range + "&interval=" + interval;
        log.info("Fetching market data from Yahoo: {}", url);

        return webClientBuilder.build()
                .get()
                .uri(url)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
                .header("Accept", "application/json")
                .retrieve()
                .bodyToMono(String.class)
                .onErrorResume(e -> {
                    log.error("Error fetching market data for {}: {}", symbol, e.getMessage());
                    return Mono.error(new RuntimeException("Market data currently unavailable"));
                });
    }
}
