package todo_do.Backend.Controller;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import todo_do.Backend.DTO.LlamaRequestDTO;
import todo_do.Backend.DTO.LlamaResponseDTO;
import todo_do.Backend.Services.LlamaService;

@RestController
@RequestMapping("/api/llama")
@PreAuthorize("hasRole('USER')")
public class LlamaController {

    @Autowired
    private LlamaService llamaService;

    @PostMapping
    public LlamaResponseDTO generateAnswer(@RequestBody LlamaRequestDTO request) {
        return llamaService.generateAnswer(request.getPrompt());
    }
}
