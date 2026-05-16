package in.equitylabs.orders.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.domain.Persistable;
import org.springframework.data.annotation.Transient;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("orders")
public class Order implements Persistable<String> {
    @Id
    private String orderId;
    private String userId;
    private String symbol;
    private Integer quantity;
    private Integer remainingQty;
    private BigDecimal price;
    private OrderType orderType;
    private OrderCategory orderCategory;
    private String status; // e.g., PENDING, FILLED, CANCELLED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Transient
    @Builder.Default
    private boolean isNew = true;

    @Override
    public String getId() {
        return orderId;
    }

    @Override
    public boolean isNew() {
        return isNew;
    }
}
