import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import todo_do.Backend.Domain.Category.Category;
import todo_do.Backend.Repository.CategoryRepository;
import todo_do.Backend.Services.CategoryService;

import java.util.List;
import java.util.UUID;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;



    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }
    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }
    @Override
    public Category findById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
}
