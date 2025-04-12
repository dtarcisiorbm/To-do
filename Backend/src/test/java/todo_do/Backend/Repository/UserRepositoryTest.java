package todo_do.Backend.Repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;
import todo_do.Backend.Domain.User.User;
import todo_do.Backend.Repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Given
        testUser = User.builder()
                .username("testUser")
                .email("test@example.com")
                .password("password324234")
                .build();
        userRepository.save(testUser);
    }

    @Test
    void findByUsernameOrEmail_ExistingUser_ReturnsUser() {
        // When
        Optional<User> foundUser = userRepository.findByUsernameOrEmail("testUser", "anyEmail@example.com");

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals("testUser", foundUser.get().getUsername());
    }

    @Test
    void findByUsernameOrEmail_NonExistingUser_ReturnsEmpty() {
        // When
        Optional<User> foundUser = userRepository.findByUsernameOrEmail("nonExistingUser", "anyEmail@example.com");

        // Then
        assertFalse(foundUser.isPresent());
    }

    @Test
    void findByUsername_ExistingUser_ReturnsUser() {
        // When
        Optional<User> foundUser = userRepository.findByUsername("testUser");

        // Then
        assertTrue(foundUser.isPresent());
        assertEquals("testUser", foundUser.get().getUsername());
    }

    @Test
    void findByUsername_NonExistingUser_ReturnsEmpty() {
        // When
        Optional<User> foundUser = userRepository.findByUsername("nonExistingUser");

        // Then
        assertFalse(foundUser.isPresent());
    }
}
