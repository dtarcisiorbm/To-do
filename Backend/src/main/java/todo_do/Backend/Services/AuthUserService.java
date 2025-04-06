package todo_do.Backend.Services;

import org.springframework.stereotype.Service;
import todo_do.Backend.DTO.AuthUserRequestDTO;
import todo_do.Backend.DTO.AuthUserResponseDTO;

import javax.naming.AuthenticationException;


public interface AuthUserService {
    AuthUserResponseDTO execute(AuthUserRequestDTO authUserRequestDTO) throws AuthenticationException;
}