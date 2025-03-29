package todo_do.Backend.Services;


import org.springframework.stereotype.Service;
import todo_do.Backend.Domain.User.User;

import java.util.List;
import java.util.UUID;


@Service
public interface UserServices {

    List<User> getUser ();
    void insertUser(User user);
    void updateUser(UUID id,User user ) throws Exception;
    void deleteUser(User user );


}
