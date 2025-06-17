package todo_do.Backend.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import todo_do.Backend.DTO.IAResponseDTO;
import todo_do.Backend.DTO.TaskDTO;
import todo_do.Backend.Domain.Task.Task;
import todo_do.Backend.Implements.TaskServiceImpl;
import todo_do.Backend.Repository.TaskRepository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class IAServices {

    @Autowired
    private TaskRepository taskRepository;
    public IAResponseDTO generateDescription(String prompt) {
        try {
            if (prompt == null || prompt.isEmpty()) {
                System.out.println("Prompt vazio ou nulo");
                return null;
            }
            String result = String.format("Faça um resumo de uma tarefa : %s (maximum 150 characters).", prompt);

            // Serializa o prompt com aspas corretamente
            ObjectMapper mapper = new ObjectMapper();
            String escapedPrompt = mapper.writeValueAsString(result); // inclui aspas corretamente


            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:5678/webhook-test/description"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(160))
                    .POST(HttpRequest.BodyPublishers.ofString(escapedPrompt))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());


            if (response.statusCode() == 200) {
                IAResponseDTO dto = mapper.readValue(response.body(), IAResponseDTO.class);
                return dto; // ✅ retorna apenas o texto
            } else {
                System.out.println("Erro HTTP: " + response.statusCode() + " - " + response.body());
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String checkAvailability(String date, List<Task> horariosOcupados) {

        try {

            if (date == null || date.isEmpty()) {
                System.out.println("Data vazia ou nula" + date);
                return null;
            }


            String result = String.format("""
                    Você é um assistente de agendamento.
                    No dia %s, já existem compromissos nos seguintes horários: [%s].
                    
                    Liste apenas os horários ocupados deste dia no formato "HH:mm - HH:mm", como um array de strings JSON.
                    Não adicione explicações, apenas retorne a lista de horários ocupados.
                    """, date, horariosOcupados);

            ObjectMapper mapper = new ObjectMapper();
            String escapedPrompt = mapper.writeValueAsString(result);

            String requestBody = """
                    
                    """.formatted(escapedPrompt);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:5678/webhook/date"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(escapedPrompt))
                    .timeout(Duration.ofSeconds(100))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                IAResponseDTO dto = mapper.readValue(response.body(), IAResponseDTO.class);
                return dto.getResponse();
            } else {
                System.out.println("Error HTTP: " + response.statusCode() + " - " + response.body());
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public IAResponseDTO sendEmail(UUID taskId) {
        try {
            if (taskId == null) {
                System.out.println("taskId vazio ou nulo");
                return null;
            }

            ObjectMapper mapper = new ObjectMapper();
            // Cria um objeto JSON com o campo "taskId"
            String requestBody = "{\"taskId\":\"" + taskId + "\"}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("hhttp://localhost:5678/webhook/email"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(160))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                IAResponseDTO dto = mapper.readValue(response.body(), IAResponseDTO.class);
                return dto; // ✅ retorna apenas o texto
            } else {
                System.out.println("Erro HTTP: " + response.statusCode() + " - " + response.body());
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String generateTaskFromLanguage(String prompt, String userId) {
        try {
            if (prompt == null || prompt.isEmpty()) {
                System.out.println("Prompt vazio ou nulo");
                return null;
            }
            if (userId == null || userId.isEmpty()) {
                return "Sem usuário";
            }
            String result = String.format(prompt);

            // Cria um objeto JSON com os parâmetros
            ObjectMapper mapper = new ObjectMapper();
            String requestBody = mapper.writeValueAsString(Map.of(
                "prompt", result,
                "userId", userId.toString()
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:5678/webhook-test/languagetask"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(160))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {

                return "Tarefa criada com sucesso! ID: ";
            } else {
                System.out.println("Erro HTTP: " + response.statusCode() + " - " + response.body());
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
