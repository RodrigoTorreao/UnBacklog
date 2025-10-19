package UnB.UnBacklog.service;

import java.util.UUID;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import UnB.UnBacklog.repository.UserRepository;
import UnB.UnBacklog.entities.User;
@Service
public class UserService {
    private UserRepository userRepository;
    private JwtDecoder jwtDecoder; 

    public UserService(UserRepository userRepository, JwtDecoder jwtDecoder){
        this.userRepository = userRepository; 
        this.jwtDecoder = jwtDecoder;
    }
    
    public record filteredUser(String name, String email, UUID id) {
    }

    public filteredUser getMe(String jwtToken){
        if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
            jwtToken = jwtToken.substring(7);
        }
        
        Jwt token = jwtDecoder.decode(jwtToken);

        String userId = token.getSubject();
        
        UUID uuid = UUID.fromString(userId);
        
        User fullUser = this.userRepository.findById(uuid)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + userId));
        
        return new filteredUser(fullUser.getName(), fullUser.getEmail(), fullUser.getUserId());
    } 
}