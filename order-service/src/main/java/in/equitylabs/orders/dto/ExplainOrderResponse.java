package in.equitylabs.orders.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExplainOrderResponse {
    private String symbol;
    private String explanation;
}
