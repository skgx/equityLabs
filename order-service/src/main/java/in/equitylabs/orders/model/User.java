package in.equitylabs.orders.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("users")
public class User implements Persistable<String> {
    @Id
    private String userId;
    private String fullName;
    private String email;
    private String username;
    private String password; // Will store BCrypt hash
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Transient
    @Builder.Default
    private boolean isNewUser = true;

    @Override
    public String getId() {
        return userId;
    }

    @Override
    public boolean isNew() {
        return isNewUser;
    }
}
