package todo_do.Backend.Exceptions;

public class UserFoundException extends RuntimeException  {
    public UserFoundException(String userNotFound){
        super("Usuário já existe!");
    }
}
