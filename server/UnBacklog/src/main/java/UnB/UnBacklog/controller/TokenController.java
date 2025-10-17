package UnB.UnBacklog.controller;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.web.bind.annotation.RestController;

import UnB.UnBacklog.controller.dto.LoginRequest;
import UnB.UnBacklog.controller.dto.LoginResponse;
import UnB.UnBacklog.service.AuthService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/api/auth")
public class TokenController {
    private final AuthService authService;
    
    public TokenController(AuthService authService) {
        this.authService = authService;
    }

    record registerRequest(String name, String email, String password){}
    record registerResponse(String accessToken){}

    record ErrorResponse(String message) {}


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            // gera o token via AuthService
            String jwtToken = authService.login(loginRequest.email(), loginRequest.password());

            // Cria cookie httpOnly
            Cookie cookie = new Cookie("token", jwtToken);
            cookie.setHttpOnly(true);       // protege contra acesso via JS
            cookie.setSecure(false);        // true se estiver em HTTPS
            cookie.setPath("/");            // válido para todas as rotas
            cookie.setMaxAge(60 * 60);      // expira em 1 hora

            response.addCookie(cookie);     // adiciona cookie à resposta

            // Retorna apenas mensagem de sucesso
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody registerRequest registerRequest, HttpServletResponse response) {
        try {
            String jwtToken = authService.register(registerRequest.email(), registerRequest.password(), registerRequest.name());

            // Cria cookie httpOnly
            Cookie cookie = new Cookie("token", jwtToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60);
            response.addCookie(cookie);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

}
