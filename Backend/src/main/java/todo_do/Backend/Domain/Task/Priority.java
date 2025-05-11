package todo_do.Backend.Domain.Task;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING, with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)
public enum Priority {
    low,
    medium,
    high;

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}