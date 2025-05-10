package todo_do.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import todo_do.Backend.Domain.Task.Priority;
import todo_do.Backend.Domain.Task.Category;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class TaskDTO {
    private UUID id;
    private String title;
    private String description;
    private Priority priority;
    private Category category;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID userId;
    private String username;
}
