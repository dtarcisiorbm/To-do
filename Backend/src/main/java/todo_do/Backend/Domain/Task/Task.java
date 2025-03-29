package todo_do.Backend.Domain.Task;


import jakarta.persistence.*;
import lombok.*;
import todo_do.Backend.Domain.User.User;

import java.util.UUID;

@Entity
@Table(name="Task")
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    String title;
    String descrition;
    Boolean conlusion;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @PrePersist
    private void gerarDados() {
        if (id == null) {
            this.id = java.util.UUID.randomUUID();
        }
    }
}
