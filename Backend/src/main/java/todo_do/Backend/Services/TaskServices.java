package todo_do.Backend.Services;


import org.springframework.http.ResponseEntity;
import todo_do.Backend.DTO.TaskDTO;
import todo_do.Backend.Domain.Task.Task;

import java.util.List;
import java.util.UUID;


public interface TaskServices {
    List<Task> getTask();
    List<TaskDTO> getTaskForUser(UUID userId);
    List<TaskDTO> getTaskId(UUID id);
    void insertTask(Task task);
    void updateTask(UUID id, Task task) throws Exception;
    ResponseEntity<String> deleteTask(UUID id);
}
