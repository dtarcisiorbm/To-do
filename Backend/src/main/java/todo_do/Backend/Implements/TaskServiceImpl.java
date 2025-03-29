package todo_do.Backend.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Repository.TaskRepository;
import todo_do.Backend.Services.TaskServices;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskServices {
    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<Task> getTask() {
        return taskRepository.findAll();
    }

    @Override
    public void insertTask(Task task) {
        taskRepository.save(task);
    }

    @Override
    public void updateTask(UUID id, Task task) throws Exception {
        Optional<Task> taskExist = taskRepository.findById(id);
        if (taskExist.isPresent()) {
            Task taskExists = taskExist.get();
            taskRepository.save(taskExists);
        } else {
            throw new Exception("Task not found");
        }
    }

    @Override
    public void deleteTask(UUID id) {
        Optional<Task> taskExist = taskRepository.findById(id);
        taskExist.ifPresent(taskRepository::delete);
    }
}
