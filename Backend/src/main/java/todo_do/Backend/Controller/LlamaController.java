package todo_do.Backend.Controller;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import todo_do.Backend.DTO.LlamaRequestDTO;
import todo_do.Backend.DTO.LlamaResponseDTO;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Services.LlamaService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/llama")
@PreAuthorize("hasRole('USER')")
public class LlamaController {

    @Autowired
    private LlamaService llamaService;

    @PostMapping
    public LlamaResponseDTO generateAnswer(@RequestBody LlamaRequestDTO request) {
        return llamaService.generateDescription(request.getPrompt());
    }
    @PostMapping("/check-availability")
public String checkAvailability(@RequestBody Map<String, Object> payload) {
        System.out.println("Payload recebido: " + payload);
        try {
            String date = (String) payload.get("date");
            List<Task> horarios = (List<Task>) payload.get("horariosOcupados");
            return llamaService.checkAvailability(date, horarios);
        } catch (Exception e) {
            e.printStackTrace();
            return "Erro ao processar solicitação";
        }
    }
}
