package in.equitylabs.orders.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.equitylabs.orders.model.Trade;
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
public class TradeStreamHandler implements WebSocketHandler {

    private final Sinks.Many<Trade> tradeSink = Sinks.many().multicast().directBestEffort();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void broadcastTrade(Trade trade) {
        tradeSink.tryEmitNext(trade);
    }

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        log.info("New WebSocket connection: {}", session.getId());

        Flux<WebSocketMessage> messageFlux = tradeSink.asFlux()
                .map(trade -> {
                    try {
                        return objectMapper.writeValueAsString(trade);
                    } catch (JsonProcessingException e) {
                        return "{}";
                    }
                })
                .map(session::textMessage);

        return session.send(messageFlux)
                .doOnTerminate(() -> log.info("WebSocket session terminated: {}", session.getId()));
    }
}
