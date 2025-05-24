package todo_do.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import todo_do.Backend.DTO.TaskDTO;
import todo_do.Backend.Domain.Task.Task;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository <Task, UUID> {

    List<Task> findByUserId(UUID userId);
    Optional<Task> findById(UUID id);

    List<TaskDTO> findByDueDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT new todo_do.Backend.DTO.TaskDTO(t.id, t.title, t.description, t.priority, t.category, t.completed, t.dueDate, t.createdAt, t.updatedAt, t.user.id, t.user.username) FROM Task t WHERE t.dueDate BETWEEN :start AND :end")
    List<TaskDTO> findTaskDTOsByDueDateBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    void deleteById(UUID id);
}
