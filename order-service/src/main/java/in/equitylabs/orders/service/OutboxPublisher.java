package in.equitylabs.orders.service;

import in.equitylabs.orders.repository.OutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class OutboxPublisher {

    private final OutboxRepository outboxRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    /**
     * Polls the outbox table every 5 seconds for pending events.
     * In a production environment, we might use a CDC tool like Debezium,
     * but this polling approach is perfect for learning the pattern.
     */
    @Scheduled(fixedDelay = 5000)
    public void publishEvents() {
        outboxRepository.findByStatus("PENDING")
                .flatMap(event -> {
                    log.info("Publishing event {} to Kafka topic 'orders-in'", event.getAggregateId());
                    
                    // We use Mono.fromFuture to integrate Kafka's CompletableFuture into our reactive flow
                    return Mono.fromFuture(kafkaTemplate.send("orders-in", event.getAggregateId(), event.getPayload()))
                            .flatMap(result -> {
                                event.setStatus("PROCESSED");
                                event.setProcessedAt(LocalDateTime.now());
                                return outboxRepository.save(event);
                            })
                            .onErrorResume(e -> {
                                log.error("Failed to publish event {}: {}", event.getAggregateId(), e.getMessage());
                                event.setStatus("FAILED");
                                return outboxRepository.save(event);
                            });
                })
                .subscribe(); // We must subscribe because @Scheduled methods are not naturally reactive
    }
}
