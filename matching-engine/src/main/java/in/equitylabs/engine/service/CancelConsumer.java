package in.equitylabs.engine.service;

import in.equitylabs.engine.MatchEngine;
import in.equitylabs.engine.dto.CancelRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CancelConsumer {

    private final MatchEngine matchEngine;

    @KafkaListener(topics = "orders-cancel", groupId = "matching-engine-group")
    public void consumeCancel(CancelRequest request) {
        log.info("CANCEL REQUEST RECEIVED: ID={} | SYMBOL={}", request.getOrderId(), request.getSymbol());
        matchEngine.cancelOrder(request.getSymbol(), request.getOrderId());
    }
}
