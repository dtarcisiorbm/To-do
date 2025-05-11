package todo_do.Backend.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import todo_do.Backend.DTO.TaskDTO;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Services.EmailServices;
import todo_do.Backend.Services.TaskServices;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/task")
@PreAuthorize("hasRole('USER')")
@SecurityRequirement(name = "Bearer Authentication")
public class TaskController {
    @Autowired
    private EmailServices emailServices;

    @Autowired
    private TaskServices taskServices;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        var tasks = taskServices.getTask();
        return ResponseEntity.ok(tasks);
    }



    @GetMapping("/{id}")
    public ResponseEntity<List<TaskDTO>> getTasksId(@PathVariable UUID id) {
        var tasks = taskServices.getTaskId(id);
        return ResponseEntity.ok(tasks);
    }@GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDTO>> getTasksForUser(@PathVariable UUID userId) {
        var tasks = taskServices.getTaskForUser(userId);
        return ResponseEntity.ok(tasks);
    }




    @PostMapping
    public ResponseEntity<String> insertTask(@RequestBody Task taskDetails) {
        try {
            System.out.println("Task details: " + taskDetails);
            taskServices.insertTask(taskDetails);
            emailServices.sendEmail( "haospa.dark@gmail.com","Bem-vindo ao nosso serviço!", " Task Criada!");
            return ResponseEntity.ok("Task created!");
        } catch (Exception e) {
            throw new RuntimeException("Error creating task: " + e.getMessage());
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTask(@PathVariable UUID id, @RequestBody Task taskDetails) {
        try {
            taskServices.updateTask(id, taskDetails);
            return ResponseEntity.ok("Task updated!");
        } catch (Exception e) {
            throw new RuntimeException("Error updating task: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable UUID id) {

        return taskServices.deleteTask(id);
    }
}
