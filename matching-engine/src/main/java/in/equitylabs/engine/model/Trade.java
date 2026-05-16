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
public class Trade {
    private String tradeId;
    private String symbol;
    private String buyOrderId;
    private String sellOrderId;
    private String buyUserId;
    private String sellUserId;
    private BigDecimal executedPrice;
    private Integer quantity;
    private LocalDateTime tradedAt;
}
