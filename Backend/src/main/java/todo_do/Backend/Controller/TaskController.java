package todo_do.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Services.TaskServices;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    @Autowired
    private TaskServices taskServices;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        var tasks = taskServices.getTask();
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<String> insertTask(@RequestBody Task taskDetails) {
        try {
            taskServices.insertTask(taskDetails);
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
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        taskServices.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
