package todo_do.Backend.Domain.Category;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import todo_do.Backend.Domain.Task.Task;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;
    private String name;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Task> tasks;
    @PrePersist
    private void gerarDados() {
        if (id == null) {
            this.id = java.util.UUID.randomUUID();
        }
    }
}