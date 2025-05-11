package todo_do.Backend.Domain.Task;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING, with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)
public enum Category {
    personal,
    work,
    study,
    health;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
