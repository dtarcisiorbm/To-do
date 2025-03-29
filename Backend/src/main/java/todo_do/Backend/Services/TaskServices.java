package todo_do.Backend.Services;

import org.springframework.stereotype.Service;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Domain.User.User;

import java.util.UUID;

@Service
public interface TaskServices {
    void getTask();
    void insertTask(Task task);
    void updateTask(UUID id, Task task ) throws Exception;
    void deleteTask(Task task );
}
