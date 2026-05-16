package in.equitylabs.orders.repository;

import in.equitylabs.orders.model.Order;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface OrderRepository extends R2dbcRepository<Order, String> {
    Flux<Order> findByUserId(String userId);
    Flux<Order> findBySymbol(String symbol);
}
