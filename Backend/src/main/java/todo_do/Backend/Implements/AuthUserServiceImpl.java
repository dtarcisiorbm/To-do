package todo_do.Backend.Implements;

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
import todo_do.Backend.Services.AuthUserService;

import javax.naming.AuthenticationException;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;

@Service
public class AuthUserServiceImpl implements AuthUserService {

    @Value("${security.token.secret}")
    private String secretKey;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthUserResponseDTO execute(AuthUserRequestDTO authCandidateRequestDTO) throws AuthenticationException {
        var candidate = userRepository.findByUsername(authCandidateRequestDTO.username())
                .orElseThrow(() -> new UsernameNotFoundException("Username/password incorrect"));

        if (!passwordEncoder.matches(authCandidateRequestDTO.password(), candidate.getPassword())) {
            throw new AuthenticationException();
        }

        Instant expiresIn = Instant.now().plus(Duration.ofMinutes(10));
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        String token = JWT.create()
                .withIssuer("javagas")
                .withClaim("roles", Collections.singletonList("CANDIDATE"))
                .withExpiresAt(expiresIn)
                .withSubject(candidate.getId().toString())
                .sign(algorithm);

        return AuthUserResponseDTO.builder()
                .accessToken(token)
                .expires_in(expiresIn.toEpochMilli())
                .build();
    }
}
