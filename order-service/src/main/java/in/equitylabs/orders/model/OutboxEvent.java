package in.equitylabs.orders.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("outbox_events")
public class OutboxEvent {
    @Id
    private Long id;
    private String aggregateId; // The Order ID
    private String aggregateType; // "ORDER"
    private String payload; // The JSON string of the order
    private String status; // PENDING, PROCESSED, FAILED
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
}
