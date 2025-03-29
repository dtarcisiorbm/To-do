package todo_do.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import todo_do.Backend.Services.TaskServices;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    @Autowired
    private TaskServices taskServices;




}
