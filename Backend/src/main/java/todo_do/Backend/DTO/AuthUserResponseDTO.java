package todo_do.Backend.DTO;

import lombok.*;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuthUserResponseDTO {
    private String accessToken;
    private Long expires_in;
}
