package todo_do.Backend.Implements;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import todo_do.Backend.Domain.User.User;
import todo_do.Backend.Repository.UserRepository;
import todo_do.Backend.Services.UserServices;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserServices {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getUser() {
        return userRepository.findAll();
    }

    @Override
    public void insertUser(User user) {
        System.out.println(user +"User service");
        // Criptografa a senha antes de salvar
        if (user.getPassword() != null) {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
        }

        userRepository.save(user);
    }

    @Override
    public void updateUser(UUID id, User user) throws Exception {
        Optional<User> userExist = userRepository.findById(id);
        if (userExist.isPresent()) {
            User userExists = userExist.get();

            if (user.getPassword() != null) {
                String encodedPassword = passwordEncoder.encode(user.getPassword());
                userExists.setPassword(encodedPassword);
            }

            userRepository.save(userExists);
        } else {
            throw new Exception("User not found");
        }
    }

    @Override
    public void deleteUser(UUID id) {
        userRepository.findById(id).ifPresent(userRepository::delete);
    }
}
