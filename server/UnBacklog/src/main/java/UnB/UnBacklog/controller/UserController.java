package UnB.UnBacklog.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import UnB.UnBacklog.service.UserService;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CookieValue;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService; 

    public UserController(UserService userService){ 
        this.userService = userService; 
    }

    public record ErrorResponse(String message) {}

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@CookieValue(name = "token", required = false) String token, HttpServletResponse response) {
        try{    
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Token não encontrado"));
            }
            
            UserService.filteredUser user = userService.getMe(token);
            return ResponseEntity.ok().body(user); 
        }
        catch (Exception e){
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        }
    }
}