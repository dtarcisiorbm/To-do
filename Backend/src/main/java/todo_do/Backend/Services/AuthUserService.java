package todo_do.Backend.Services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import todo_do.Backend.DTO.AuthUserRequestDTO;
import todo_do.Backend.DTO.AuthUserResponseDTO;
import todo_do.Backend.Repository.UserRepository;

import javax.naming.AuthenticationException;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;

@Service
public class AuthUserService {
    @Value("${security.token.secret}")
    private String secretkey;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthUserResponseDTO execute(AuthUserRequestDTO authCandidateRequestDTO) throws AuthenticationException {
        var candidate = userRepository.findByUsername(authCandidateRequestDTO.username()).orElseThrow(() -> {
            throw new UsernameNotFoundException("Username/password incorrect");
        });
        var passwordMatches = this.passwordEncoder.matches(authCandidateRequestDTO.password(), candidate.getPassword());

        if (!passwordMatches) {
            throw new AuthenticationException();
        }
        var expiresIn=Instant.now().plus(Duration.ofMinutes(10));
        Algorithm algorithm = Algorithm.HMAC256(secretkey);
        var token = JWT.create().withIssuer("javagas").withClaim("roles", Arrays.asList("CANDIDATE")).withExpiresAt(expiresIn).withSubject(candidate.getId().toString()).sign(algorithm);
        var authUserResponse = AuthUserResponseDTO.builder().accessToken(token).expires_in(expiresIn.toEpochMilli()).build();
        return authUserResponse;
    }
}
