package todo_do.Backend.Services;


import todo_do.Backend.Domain.Task.Task;

import java.util.List;
import java.util.UUID;


public interface TaskServices {
    List<Task> getTask();
    void insertTask(Task task);
    void updateTask(UUID id, Task task) throws Exception;
    void deleteTask(UUID id);
}
