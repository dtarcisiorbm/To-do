package todo_do.Backend.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import todo_do.Backend.DTO.TaskDTO;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Domain.User.User;
import todo_do.Backend.Repository.TaskRepository;
import todo_do.Backend.Repository.UserRepository;
import todo_do.Backend.Services.IAServices;
import todo_do.Backend.Services.TaskServices;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    @Autowired
    private IAServices iaServices;

    private User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        var userId = UUID.fromString(authentication.getName());
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

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
                    task.getDescription(),
                    task.getPriority(),
                    task.getCategory(),
                    task.getCompleted(),
                    task.getDueDate(),
                    task.getCreatedAt(),
                    task.getUpdatedAt(),
                    task.getUser().getId(),
                    task.getUser().getUsername()
            )).collect(Collectors.toList());
        }
    }

    @Override
    public List<TaskDTO> getTaskId(UUID id) {

        Optional<Task> taskOptional = taskRepository.findById(id);

        if (taskOptional.isEmpty()) {
            throw new RuntimeException("Usuário com o ID " + id + " não encontrado no banco de dados.");
        } else {
            Optional<Task> tasks = taskRepository.findById(id);

            if (tasks.isEmpty()) {
                System.out.println("Nenhuma tarefa encontrada para o usuário " + id);
            }

            return tasks.stream().map(task -> new TaskDTO(
                    task.getId(),
                    task.getTitle(),
                    task.getDescription(),
                    task.getPriority(),
                    task.getCategory(),
                    task.getCompleted(),
                    task.getDueDate(),
                    task.getCreatedAt(),
                    task.getUpdatedAt(),
                    task.getUser().getId(),
                    task.getUser().getUsername()
            )).collect(Collectors.toList());
        }
    }


    @Override
    public List<TaskDTO> getTasksByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59, 999999999);
        List<TaskDTO> tasks = taskRepository.findTaskDTOsByDueDateBetween(startOfDay, endOfDay);
        if (tasks.isEmpty()) {
            throw new RuntimeException("Nenhuma tarefa encontrada para a data fornecida.");
        }
        return tasks;
    }

    @Override
    public void insertTask(Task task) {
        User currentUser = getCurrentUser();
        task.setUser(currentUser);
        task.setCompleted(false);

        taskRepository.save(task);
        iaServices.sendEmail(task.getId());
    }

    @Override
    public void updateTask(UUID id, Task task) throws Exception {
        Optional<Task> taskExist = taskRepository.findById(id);
        if (taskExist.isPresent()) {
            Task taskExists = taskExist.get();


            taskExists.setTitle(task.getTitle());
            taskExists.setPriority(task.getPriority());
            taskExists.setCategory(task.getCategory());
            taskExists.setDescription(task.getDescription());
            taskExists.setDueDate(task.getDueDate());
            taskExists.setCompleted(task.getCompleted());


            taskRepository.save(taskExists);
        } else {
            throw new Exception("Task not found");
        }
    }

    @Override
    public ResponseEntity<String> deleteTask(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task não encontrada"));

        taskRepository.deleteById(id);
        return ResponseEntity.ok("Task deletada com sucesso!");
    }
}
