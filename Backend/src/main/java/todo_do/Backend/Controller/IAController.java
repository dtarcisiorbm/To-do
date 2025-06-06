package todo_do.Backend.Controller;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import todo_do.Backend.DTO.IARequestDTO;
import todo_do.Backend.DTO.IAResponseDTO;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Services.IAServices;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/llama")
@PreAuthorize("hasRole('USER')")
public class IAController {

    @Autowired
    private IAServices IAServices;

    @PostMapping
    public IAResponseDTO generateAnswer(@RequestBody IARequestDTO request) {
        return IAServices.generateDescription(request.getPrompt());
    }
    @PostMapping("/check-availability")
public String checkAvailability(@RequestBody Map<String, Object> payload) {

        try {
            String date = (String) payload.get("date");
            List<Task> horarios = (List<Task>) payload.get("horariosOcupados");
            return IAServices.checkAvailability(date, horarios);
        } catch (Exception e) {
            e.printStackTrace();
            return "Erro ao processar solicitação";
        }
    }
}
