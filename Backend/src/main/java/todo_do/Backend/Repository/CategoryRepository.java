package todo_do.Backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import todo_do.Backend.Domain.Category.Category;

import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}
