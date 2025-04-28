package todo_do.Backend.Services;

import todo_do.Backend.Domain.Category.Category;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    Category save(Category category);

    List<Category> findAll();

    Category findById(Long id);

    Category findById(UUID id);
}
