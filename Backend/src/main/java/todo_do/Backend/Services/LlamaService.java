package todo_do.Backend.Services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import todo_do.Backend.DTO.LlamaResponseDTO;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class LlamaService {

    public LlamaResponseDTO generateAnswer(String prompt) {
        try {
            // Monta o prompt com base no input
            String result = String.format("Faça uma descrição breve sobre %s no maximo 6 linhas", prompt);

            // Serializa o prompt com aspas corretamente
            ObjectMapper mapper = new ObjectMapper();
            String escapedPrompt = mapper.writeValueAsString(result); // inclui aspas corretamente

            String requestBody = """
                {
                  "model": "llama3:8b",
                  "prompt": %s,
                  "stream": false,
                  "max_tokens": 30
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
}
