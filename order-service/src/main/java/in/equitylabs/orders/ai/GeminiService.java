package in.equitylabs.orders.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    private final WebClient webClient = WebClient.create("https://generativelanguage.googleapis.com");
    private final ReactiveRedisTemplate<String, String> redisTemplate;

    private static final String CACHE_PREFIX = "ai-cache:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    public Mono<String> ask(String prompt) {
        String cacheKey = CACHE_PREFIX + Integer.toHexString(prompt.hashCode());

        return redisTemplate.opsForValue().get(cacheKey)
                .switchIfEmpty(
                        callGemini(prompt)
                                .flatMap(response ->
                                        redisTemplate.opsForValue()
                                                .set(cacheKey, response, CACHE_TTL)
                                                .thenReturn(response)
                                )
                );
    }

    private Mono<String> callGemini(String prompt) {
        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                },
                "generationConfig", Map.of(
                        "temperature", 0.3,
                        "maxOutputTokens", 300,
                        "topP", 0.8
                )
        );

        return webClient.post()
                .uri("/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    var candidates = (List<?>) response.get("candidates");
                    var firstCandidate = (Map<?, ?>) candidates.get(0);
                    var content = (Map<?, ?>) firstCandidate.get("content");
                    var parts = (List<?>) content.get("parts");
                    var firstPart = (Map<?, ?>) parts.get(0);
                    return (String) firstPart.get("text");
                })
                .doOnError(e -> log.error("Gemini API error: {}", e.getMessage()));
    }

    public Mono<String> explainOrder(String symbol, int qty, double price,
                                     String type, String category,
                                     double bestBid, double bestAsk) {
        String prompt = String.format("""
                You are a concise financial analyst AI. Explain this trading order in 2-3 sentences.
                
                Order details:
                - Symbol: %s
                - Quantity: %d
                - Price: %.2f
                - Type: %s
                - Category: %s (LIMIT orders only execute at the specified price or better; MARKET orders execute immediately at best available price)
                - Current Best Bid: %.2f, Best Ask: %.2f
                
                Explain what this order means and what will happen. Use plain English.
                No markdown formatting. Maximum 3 sentences.
                """, symbol, qty, price, type, category, bestBid, bestAsk);

        return ask(prompt);
    }

    public Mono<String> analyzeTradeAnomaly(String symbol, double executedPrice,
                                            double avgPrice, int quantity,
                                            int avgQuantity) {
        if (avgPrice == 0 || avgQuantity == 0) return Mono.just("{\"anomalyScore\": 0.0, \"type\": \"NORMAL\", \"explanation\": \"Not enough data.\"}");

        double priceDev = Math.abs(executedPrice - avgPrice) / avgPrice * 100;
        double qtyDev = (double) quantity / avgQuantity;

        if (priceDev < 1.5 && qtyDev < 3) {
            return Mono.just("{\"anomalyScore\": 0.0, \"type\": \"NORMAL\", \"explanation\": \"Trade executed within normal parameters.\"}");
        }

        String prompt = String.format("""
                You are a market surveillance AI. A trade just executed with these details:
                
                - Symbol: %s
                - Executed price: %.2f
                - Average price (last hour): %.2f (deviation: %.1f%%)
                - Trade quantity: %d
                - Average quantity (last hour): %d (ratio: %.1fx)
                
                Is this anomalous? Respond with JSON only:
                {"anomalyScore": 0.0-1.0, "type": "PRICE_SPIKE|VOLUME_SURGE|NORMAL", "explanation": "one sentence"}
                """, symbol, executedPrice, avgPrice, priceDev, quantity, avgQuantity, qtyDev);

        return ask(prompt);
    }

    public Mono<String> generateMarketSummary(String symbol, long totalOrders,
                                              long totalTrades, double buyRatio,
                                              double lastPrice, double priceChange) {
        String prompt = String.format("""
                You are a real-time market analyst. Summarize market activity in 2-3 sentences.
                
                Symbol: %s
                - Total orders last hour: %d
                - Trades executed: %d
                - Buy order ratio: %.0f%%
                - Last traded price: %.2f
                - Price change last hour: %.2f%%
                
                Write a concise, factual summary like a Bloomberg terminal brief.
                No markdown. No more than 3 sentences.
                """, symbol, totalOrders, totalTrades, buyRatio * 100, lastPrice, priceChange);

        return ask(prompt);
    }

    public Mono<String> suggestPrice(String symbol, String side,
                                     double bestBid, double bestAsk,
                                     double recentFillRate) {
        String prompt = String.format("""
                You are a trading strategy AI. Suggest an optimal limit price.
                
                Symbol: %s, Side: %s
                Best Bid: %.2f, Best Ask: %.2f
                Spread: %.2f
                Recent fill rate (orders filled within 5min): %.0f%%
                
                Suggest a limit price and brief reasoning.
                Respond with JSON only:
                {"price": 0.00, "confidence": "HIGH|MEDIUM|LOW", "reasoning": "one sentence"}
                """, symbol, side, bestBid, bestAsk, bestAsk - bestBid, recentFillRate * 100);

        return ask(prompt);
    }
}
