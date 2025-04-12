package todo_do.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Services.TaskServices;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/task")
public class TaskController {
    @Autowired
    private TaskServices taskServices;
    @PreAuthorize("hasRole('USER')")
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        var tasks = taskServices.getTask();
        return ResponseEntity.ok(tasks);
    }
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{userId}")
    public ResponseEntity<List<Task>> getTasksForUser(@PathVariable UUID userId) {
        var tasks = taskServices.getTaskForUser(userId);
        return ResponseEntity.ok(tasks);
    }
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{userId}/{status}")
    public ResponseEntity<List<Task>> getTaskForUserStatusCondition(@PathVariable UUID userId,@PathVariable String status) {
        var tasks = taskServices.getTaskForUserStatusCondition(userId,status);
        return ResponseEntity.ok(tasks);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<String> insertTask(@RequestBody Task taskDetails) {
        try {
            taskServices.insertTask(taskDetails);
            return ResponseEntity.ok("Task created!");
        } catch (Exception e) {
            throw new RuntimeException("Error creating task: " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTask(@PathVariable UUID id, @RequestBody Task taskDetails) {
        try {
            taskServices.updateTask(id, taskDetails);
            return ResponseEntity.ok("Task updated!");
        } catch (Exception e) {
            throw new RuntimeException("Error updating task: " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable UUID id) {

        return taskServices.deleteTask(id);
    }
}
