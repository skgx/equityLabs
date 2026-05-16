package in.equitylabs.orders.repository;

import in.equitylabs.orders.model.Trade;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface TradeRepository extends R2dbcRepository<Trade, String> {
    Flux<Trade> findByBuyUserId(String userId);
    Flux<Trade> findBySellUserId(String userId);
}
