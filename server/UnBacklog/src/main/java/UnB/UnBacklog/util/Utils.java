package UnB.UnBacklog.util;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

@Component
public class Utils {
    private final JwtDecoder jwtDecoder; 

    public Utils(JwtDecoder jwtDecoder){
        this.jwtDecoder = jwtDecoder; 
    }

    public UUID getUserIdByToken(String jwtToken){
        if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
            jwtToken = jwtToken.substring(7);
        }
        
        Jwt token = jwtDecoder.decode(jwtToken);

        String userId = token.getSubject();
        
        UUID uuid = UUID.fromString(userId);

        return uuid;
    }
}
