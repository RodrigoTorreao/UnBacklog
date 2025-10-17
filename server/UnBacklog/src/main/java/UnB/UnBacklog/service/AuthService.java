package UnB.UnBacklog.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import UnB.UnBacklog.entities.User;
import UnB.UnBacklog.repository.UserRepository;

@Service
public class AuthService {
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired
    private PasswordEncoder passwordEncoder;
    private JwtEncoder jwtEncoder; 

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtEncoder jwtEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder; 
        this.jwtEncoder = jwtEncoder; 

    } 
    public String login(String email, String password){ 
        Optional<User> optionalUser = userRepository.findByEmail(email); 

        if(optionalUser.isEmpty()){ 
            throw new BadCredentialsException("user or password incorrect"); 
        }

        User user = optionalUser.get(); 

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("user or password incorrect"); 
        }

        Instant now = Instant.now(); 
        Long expiresIn = 1800l; 

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("mybackend")
            .subject(user.getUserId().toString())
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiresIn))
            .build();
        
        String jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return jwtValue; 
        
    }

    public String register(String email, String password, String name){
        Optional<User> optionalUser = userRepository.findByEmail(email); 

        if(!optionalUser.isEmpty()){ 
            throw new BadCredentialsException("User already created"); 
        }

        User user = new User(); 
        user.setName(name);
        user.setEmail(email);
        user.setPassword(bCryptPasswordEncoder.encode(password));
        userRepository.save(user);
        
        Instant now = Instant.now(); 
        Long expiresIn = 1800l; 
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("mybackend")
            .subject(user.getUserId().toString())
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expiresIn))
            .build();
        
        String jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return jwtValue; 
        
    }
}
