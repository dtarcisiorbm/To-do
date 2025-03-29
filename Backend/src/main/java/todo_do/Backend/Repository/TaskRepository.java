package todo_do.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import todo_do.Backend.Domain.Task.Task;

import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository <Task, UUID> {


}
