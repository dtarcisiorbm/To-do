package todo_do.Backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import todo_do.Backend.Domain.Category.Category;
import todo_do.Backend.Services.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

   @Autowired
   private CategoryService categoryService;


    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.save(category);
    }

    @GetMapping
    public List<Category> listAll() {
        return categoryService.findAll();
    }
}
