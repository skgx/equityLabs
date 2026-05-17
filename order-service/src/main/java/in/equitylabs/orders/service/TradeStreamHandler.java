package in.equitylabs.orders.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.equitylabs.orders.model.Trade;
import in.equitylabs.orders.model.Order;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

@Slf4j
@Service
@RequiredArgsConstructor
public class TradeStreamHandler implements WebSocketHandler {

    private final Sinks.Many<Trade> tradeSink = Sinks.many().multicast().directBestEffort();
    private final Sinks.Many<Order> orderSink = Sinks.many().multicast().directBestEffort();
    private final ObjectMapper objectMapper;

    public void broadcastTrade(Trade trade) {
        tradeSink.tryEmitNext(trade);
    }

    public void broadcastOrderUpdate(Order order) {
        orderSink.tryEmitNext(order);
    }

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        String path = session.getHandshakeInfo().getUri().getPath();
        log.info("New WebSocket connection: {} for path: {}", session.getId(), path);

        if (path.contains("/ws/orders")) {
            return handleOrderUpdates(session);
        } else {
            return handleTradeStream(session, path);
        }
    }

    private Mono<Void> handleOrderUpdates(WebSocketSession session) {
        Flux<WebSocketMessage> messageFlux = orderSink.asFlux()
                .map(this::toJson)
                .map(session::textMessage);
        return session.send(messageFlux);
    }

    private Mono<Void> handleTradeStream(WebSocketSession session, String path) {
        // Extract symbol from /ws/trades/{symbol}
        String[] parts = path.split("/");
        final String symbol = parts.length > 3 ? parts[3] : null;

        Flux<WebSocketMessage> messageFlux = tradeSink.asFlux()
                .filter(trade -> symbol == null || trade.getSymbol().equalsIgnoreCase(symbol))
                .map(this::toJson)
                .map(session::textMessage);

        return session.send(messageFlux);
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("JSON serialization error", e);
            return "{}";
        }
    }
}
