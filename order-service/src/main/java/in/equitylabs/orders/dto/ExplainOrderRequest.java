package in.equitylabs.orders.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExplainOrderRequest {
    private String symbol;
    private int quantity;
    private double price;
    private String orderType;
    private String orderCategory;
}
