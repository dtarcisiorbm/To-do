package todo_do.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import todo_do.Backend.DTO.AuthUserRequestDTO;
import todo_do.Backend.Services.AuthUserService;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/user")
public class AuthUserController {
    @Autowired
    private AuthUserService authUserService;
    @PostMapping("/auth")
    public ResponseEntity<Object > create(@RequestBody AuthUserRequestDTO authUserRequestDTO)  {
        try {
            var result= this.authUserService.execute(authUserRequestDTO);
            return ResponseEntity.ok().body(result);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }


    }
}


