package todo_do.Backend.Implements;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import todo_do.Backend.DTO.AuthUserRequestDTO;
import todo_do.Backend.DTO.AuthUserResponseDTO;
import todo_do.Backend.DTO.UserDTO;
import todo_do.Backend.Domain.User.User;
import todo_do.Backend.Domain.User.role;
import todo_do.Backend.Repository.UserRepository;
import todo_do.Backend.Services.AuthUserService;

import javax.naming.AuthenticationException;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.UUID;

@Service
public class AuthUserServiceImpl implements AuthUserService {

    @Value("${security.token.secret}")
    private String secretKey;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthUserResponseDTO execute(AuthUserRequestDTO authUserRequestDTO) throws AuthenticationException {
        var user = userRepository.findByUsername(authUserRequestDTO.username())
                .orElseThrow(() -> new UsernameNotFoundException("Username/password incorrect"));

        boolean senhaValida = passwordEncoder.matches(authUserRequestDTO.password(), user.getPassword());

        if (!senhaValida) {
            throw new AuthenticationException("Senha inválida");
        }

        if (user.getRole() == null) {
            user.setRole(role.USER);
            userRepository.save(user);
        }

        return generateToken(user);
    }

    @Override
    public AuthUserResponseDTO register(AuthUserRequestDTO authUserRequestDTO) {
        if (userRepository.existsByUsername(authUserRequestDTO.username())) {
            throw new RuntimeException("Username already exists");
        }

        var user = new User();
        user.setUsername(authUserRequestDTO.username());
        user.setPassword(passwordEncoder.encode(authUserRequestDTO.password()));
        user.setRole(role.USER);

        userRepository.save(user);

        return generateToken(user);
    }

    private AuthUserResponseDTO generateToken(User user) {
        Instant expiresIn = Instant.now().plus(Duration.ofHours(24));
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        String token = JWT.create()
                .withIssuer("todo123#")
                .withClaim("roles", Collections.singletonList(user.getRole().name()))
                .withExpiresAt(expiresIn)
                .withSubject(user.getId().toString())
                .withClaim("type", "access")
                .sign(algorithm);

        String refreshToken = JWT.create()
                .withIssuer("todo123#")
                .withClaim("roles", Collections.singletonList(user.getRole().name()))
                .withExpiresAt(Instant.now().plus(Duration.ofDays(7)))
                .withSubject(user.getId().toString())
                .withClaim("type", "refresh")
                .sign(algorithm);

        return AuthUserResponseDTO.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .expires_in(expiresIn.toEpochMilli())
                .user(new UserDTO(user.getId(),user.getUsername(),user.getEmail(),user.getRole() ,user.getPhone()))
                .build();
    }

    @Override
    public User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            throw new UsernameNotFoundException("User not authenticated");
        }

        try {
            var userId = UUID.fromString(authentication.getName());
            return userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        } catch (IllegalArgumentException e) {
            throw new UsernameNotFoundException("Invalid user ID format");
        }
    }

    @Override
    public AuthUserResponseDTO refreshToken(String refreshToken) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            var decodedToken = JWT.require(algorithm)
                    .withClaim("type", "refresh")
                    .build()
                    .verify(refreshToken);

            var userId = UUID.fromString(decodedToken.getSubject());
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            return generateToken(user);
        } catch (Exception e) {
            throw new UsernameNotFoundException("Invalid refresh token");
        }
    }
}
