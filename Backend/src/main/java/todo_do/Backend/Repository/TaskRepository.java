package todo_do.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Domain.User.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository <Task, UUID> {

    List<Task> findByUserIdAndDeleted(UUID userId, Boolean conlusion);
    List<Task> findByUserId(UUID userId);


}
