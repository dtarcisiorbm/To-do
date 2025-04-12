package todo_do.Backend.Exceptions;

public class NotFoundTaskException extends RuntimeException  {
    public NotFoundTaskException(String userNotFound){
        super("Tarefa não encontrada!");
    }
}
