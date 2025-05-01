package todo_do.Backend.Domain.Task;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import todo_do.Backend.Domain.Category.Category;
import todo_do.Backend.Domain.User.User;

import java.time.LocalDateTime;
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
    @NotBlank()
    private String title;
    private String descrition;


    private Boolean conlusion=false;
    private Boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    @PrePersist
    private void gerarDados() {
        if (id == null) {
            this.id = java.util.UUID.randomUUID();
        }
    }

}
