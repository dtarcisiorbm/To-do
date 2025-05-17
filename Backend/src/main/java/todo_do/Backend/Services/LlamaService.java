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
            String result = String.format("Give a short description of %s (maximum 150 characters).", prompt);

            // Serializa o prompt com aspas corretamente
            ObjectMapper mapper = new ObjectMapper();
            String escapedPrompt = mapper.writeValueAsString(result); // inclui aspas corretamente

            String requestBody = """
                {
                  "model": "llama3:8b",
                  "prompt": %s,
                  "stream": false,
                  "max_tokens": 20
                }
                """.formatted(escapedPrompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:11434/api/generate"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(100))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
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
                System.out.println("Data vazia ou nula");
                return null;
            }

            // Constrói uma descrição mais natural
            String horarios = String.join(", ", horariosOcupados);
            String result = String.format("""
Você é um assistente de agenda. Dado que os horários ocupados no dia %s são: %s,
responda apenas com os horários disponíveis desse dia (sem explicações, só os intervalos livres em formato HH:mm - HH:mm).
""", date, String.join(", ", horarios));

            ObjectMapper mapper = new ObjectMapper();
            String escapedPrompt = mapper.writeValueAsString(result);

            String requestBody = """
            {
              "model": "llama3:8b",
              "prompt": %s,
              "stream": false,
              "max_tokens": 50
            }
            """.formatted(escapedPrompt);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:11434/api/generate"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(100))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
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
