package in.equitylabs.orders.dto;

import in.equitylabs.orders.model.OrderCategory;
import in.equitylabs.orders.model.OrderType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderRequest {
    private String userId;
    private String symbol;
    private Integer quantity;
    private BigDecimal price;
    private OrderType orderType;
    private OrderCategory orderCategory;
}
