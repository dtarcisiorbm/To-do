package todo_do.Backend.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import todo_do.Backend.DTO.AuthUserRequestDTO;
import todo_do.Backend.DTO.AuthUserResponseDTO;
import todo_do.Backend.Services.AuthUserService;
import todo_do.Backend.Domain.User.User;

import javax.naming.AuthenticationException;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthUserController {
    @Autowired
    private AuthUserService authUserService;

    @PostMapping("/auth")
    @Operation(summary = "Authenticate user", description = "Authenticate user with username and password")
    public ResponseEntity<AuthUserResponseDTO> authenticate(@RequestBody AuthUserRequestDTO authUserRequestDTO) {
        try {
            var result = this.authUserService.execute(authUserRequestDTO);
            return ResponseEntity.ok(result);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Register a new user with username and password")
    public ResponseEntity<AuthUserResponseDTO> register(@RequestBody AuthUserRequestDTO authUserRequestDTO) {
        try {
            var result = this.authUserService.register(authUserRequestDTO);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Logout user", description = "Logout the current user")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user", description = "Get information about the currently authenticated user")
    public ResponseEntity<User> getCurrentUser() {
        try {
            var currentUser = this.authUserService.getCurrentUser();
            return ResponseEntity.ok(currentUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Get a new access token using a refresh token")
    public ResponseEntity<AuthUserResponseDTO> refreshToken(@RequestBody Map<String, String> body) {
        try {
            String refreshToken = body.get("refreshToken");
            if (refreshToken == null) {
                return ResponseEntity.badRequest().build();
            }
            var result = this.authUserService.refreshToken(refreshToken);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
