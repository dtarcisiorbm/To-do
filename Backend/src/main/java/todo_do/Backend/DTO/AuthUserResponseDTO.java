package todo_do.Backend.DTO;

import lombok.*;
import todo_do.Backend.Domain.User.User;

import java.util.UUID;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuthUserResponseDTO {
    private String accessToken;
    private String refreshToken;
    private Long expires_in;
    private User user;
}
