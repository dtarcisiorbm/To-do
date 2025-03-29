package todo_do.Backend.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Repository.TaskRepository;
import todo_do.Backend.Services.TaskServices;

import java.util.Optional;
import java.util.UUID;

public class TaskServiceImpl implements TaskServices {
    @Autowired
    private TaskRepository taskRepository;
    public void getTask(){
        taskRepository.findAll();
    };
    public void insertTask(Task task){
        taskRepository.save(task);
    };
    public void updateTask(UUID id, Task task ) throws Exception{
        Optional<Task> taskExist= taskRepository.findById(id);
        if(taskExist.isPresent()){
            Task taskExists = taskExist.get();

            taskRepository.save(taskExists);
        } else {
            throw new Exception("Task not found");
        }
    };
    public void deleteTask(Task task ){
        taskRepository.delete(task);
    };

}
