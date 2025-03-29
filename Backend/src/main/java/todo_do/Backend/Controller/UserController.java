package todo_do.Backend.Controller;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import todo_do.Backend.Domain.User.User;
import todo_do.Backend.Services.UserServices;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserServices userServices;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        userServices.insertUser(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userServices.getUser();
        return ResponseEntity.ok(users);
    }

    @SneakyThrows
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody User userDetails) {
        userServices.updateUser(id, userDetails);
        return ResponseEntity.ok(userDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userServices.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
