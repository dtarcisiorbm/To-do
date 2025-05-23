package todo_do.Backend.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import todo_do.Backend.DTO.LlamaResponseDTO;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

@Service
public class LlamaService {

    public LlamaResponseDTO generateDescription(String prompt) {
        try {
            if(prompt == null || prompt.isEmpty()) {
                System.out.println("Prompt vazio ou nulo");
                return null;
            }
            String result = String.format("Faça um resumo de uma tarefa : %s (maximum 150 characters).", prompt);

            // Serializa o prompt com aspas corretamente
            ObjectMapper mapper = new ObjectMapper();
            String escapedPrompt = mapper.writeValueAsString(result); // inclui aspas corretamente



            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://nery-automa-n8n.dlivfa.easypanel.host/webhook/description"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(100))
                    .POST(HttpRequest.BodyPublishers.ofString(escapedPrompt))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Response: " + response.body());

            if (response.statusCode() == 200) {
                LlamaResponseDTO dto = mapper.readValue(response.body(), LlamaResponseDTO.class);
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
    public String checkAvailability(String date, List<String> horariosOcupados) {

        try {

            if (date == null || date.isEmpty()) {
                System.out.println("Data vazia ou nula"+date);
                return null;
            }

            String horarios = String.join(", ", horariosOcupados);
            String result = String.format("""
                Você é um assistente de agendamento.
                No dia %s, já existem compromissos nos seguintes horários: [%s].
                
                Liste apenas os horários ocupados deste dia no formato "HH:mm - HH:mm", como um array de strings JSON.
                Não adicione explicações, apenas retorne a lista de horários ocupados.
                """, date, horarios);

            ObjectMapper mapper = new ObjectMapper();
            String escapedPrompt = mapper.writeValueAsString(result);

            String requestBody = """
         
            """.formatted(escapedPrompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://nery-automa-n8n.dlivfa.easypanel.host/webhook-test/hour"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(100))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Response: " + response.body());

            if (response.statusCode() == 200) {
                LlamaResponseDTO dto = mapper.readValue(response.body(), LlamaResponseDTO.class);
                return dto.getResponse(); // Retorna só o texto
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
