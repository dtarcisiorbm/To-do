package todo_do.Backend.Services;

import todo_do.Backend.DTO.AuthUserRequestDTO;
import todo_do.Backend.DTO.AuthUserResponseDTO;

import javax.naming.AuthenticationException;

public interface AuthUserService {
    AuthUserResponseDTO execute(AuthUserRequestDTO authCandidateRequestDTO) throws AuthenticationException;
}