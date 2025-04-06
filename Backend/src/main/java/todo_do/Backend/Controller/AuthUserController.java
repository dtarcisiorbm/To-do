package todo_do.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import todo_do.Backend.DTO.AuthUserRequestDTO;
import todo_do.Backend.DTO.AuthUserResponseDTO;
import todo_do.Backend.Implements.AuthUserServiceImpl;
import todo_do.Backend.Services.AuthUserService;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/user")
public class AuthUserController {
    @Autowired
    private AuthUserService authUserService;

    @PostMapping("/auth")
    public ResponseEntity<AuthUserResponseDTO> create(@RequestBody AuthUserRequestDTO authUserRequestDTO) {
        System.out.println(authUserRequestDTO+"Controller");
        try {
            var result = this.authUserService.execute(authUserRequestDTO);
            return ResponseEntity.ok(result);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            e.printStackTrace(); // <-- loga qualquer outro erro que esteja passando despercebido
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



}


