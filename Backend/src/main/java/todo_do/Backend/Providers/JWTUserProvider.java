package todo_do.Backend.Providers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class JWTUserProvider {

    @Value("${security.token.secret}")
    private String secretkey;

    public DecodedJWT validateToken(String token) {
        // Validação inicial do token vazio ou nulo
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token inválido ou ausente. Por favor, forneça um token válido.");
        }

        // Removendo o prefixo "Bearer " do token, se presente
        token = token.replace("Bearer", "").trim();

        // Configurando o algoritmo HMAC com a secret key
        Algorithm algorithm = Algorithm.HMAC256(secretkey);

        try {
            // Tentativa de decodificar e validar o token
            return JWT.require(algorithm).build().verify(token);
        } catch (TokenExpiredException e) {
            // Captura de token expirado e log detalhado ou mensagem fixa
            DecodedJWT decodedToken = JWT.decode(token);
            String expirationTime = decodedToken.getExpiresAt().toString();
            throw new TokenExpiredException("Token expirado. Data de expiração: " + expirationTime, null);
        } catch (Exception e) {
            // Qualquer outra falha de verificação é tratada aqui
            throw new RuntimeException("Erro ao validar o token. Verifique as credenciais.");
        }
    }
}