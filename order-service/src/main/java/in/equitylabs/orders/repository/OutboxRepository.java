package in.equitylabs.orders.repository;

import in.equitylabs.orders.model.OutboxEvent;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface OutboxRepository extends R2dbcRepository<OutboxEvent, Long> {
    Flux<OutboxEvent> findByStatus(String status);
}
