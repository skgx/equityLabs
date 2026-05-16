package in.equitylabs.orders.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * The Order-Service's version of the Trade model.
 * It maps to the PostgreSQL 'trades' table for permanent history.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("trades")
public class Trade implements Persistable<String> {
    @Id
    private String tradeId;
    private String symbol;
    private String buyOrderId;
    private String sellOrderId;
    private String buyUserId;
    private String sellUserId;
    private BigDecimal executedPrice;
    private Integer quantity;
    private LocalDateTime tradedAt;

    @Transient
    @Builder.Default
    private boolean isNewTrade = true;

    @Override
    public String getId() {
        return tradeId;
    }

    @Override
    public boolean isNew() {
        return isNewTrade;
    }
}
