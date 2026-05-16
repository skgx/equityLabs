package in.equitylabs.engine.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private String orderId;
    private String userId;
    private String symbol;
    private Integer quantity;
    private Integer remainingQty;
    private BigDecimal price;
    private OrderType orderType;
    private OrderCategory orderCategory;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
