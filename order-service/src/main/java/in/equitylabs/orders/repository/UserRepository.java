package in.equitylabs.orders.repository;

import in.equitylabs.orders.model.User;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface UserRepository extends ReactiveCrudRepository<User, String> {
    Mono<User> findByEmail(String email);
    Mono<User> findByUsername(String username);
}
