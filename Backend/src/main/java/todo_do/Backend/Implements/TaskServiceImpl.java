package todo_do.Backend.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import todo_do.Backend.DTO.TaskDTO;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Domain.User.User;
import todo_do.Backend.Exceptions.NotFoundTaskException;
import todo_do.Backend.Repository.TaskRepository;
import todo_do.Backend.Repository.UserRepository;
import todo_do.Backend.Services.TaskServices;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskServices {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;
    @Override
    public List<Task> getTask() {
        return taskRepository.findAll();
    }

    @Override
    public List<TaskDTO> getTaskForUser(UUID userId) {

        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Usuário com o ID " + userId + " não encontrado no banco de dados.");
        } else {
            List<Task> tasks = taskRepository.findByUserId(userId);

            if (tasks.isEmpty()) {
                System.out.println("Nenhuma tarefa encontrada para o usuário " + userId);
            }

            return tasks.stream().map(task -> new TaskDTO(
                    task.getId(),
                    task.getTitle(),
                    task.getDescrition(),
                    task.getConlusion(),
                    task.getDeleted(),
                    task.getCreatedAt(),
                    task.getUpdatedAt(),
                    task.getUser().getId(),
                    task.getUser().getUsername()
            )).collect(Collectors.toList());
        }


    }

    public List<Task> getTaskForUserStatusCondition(UUID userId,String status) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Usuário com o ID " + userId + " não encontrado no banco de dados.");
        }

        List<Task> tasks = taskRepository.findByUserIdAndConlusion(userId, Boolean.valueOf(status));

        if (tasks.isEmpty()) {
            throw new NotFoundTaskException("Tarefa não encontrada!");
        }

        return tasks;
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
    public ResponseEntity<String> deleteTask(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task não encontrada"));

        task.setDeleted(true);
        taskRepository.save(task);

        return ResponseEntity.ok("Task deletada com sucesso!");
    }




}
