package UnB.UnBacklog.dto;

import java.util.UUID;

import UnB.UnBacklog.util.ProjectRole;

public class ProjectUserDTO {
    private UUID userId;
    private String userName;
    private String email;
    private ProjectRole role;

    public ProjectUserDTO(UUID userId, String userName, String email, ProjectRole role) {
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.role = role;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public ProjectRole getRole() { return role; }
    public void setRole(ProjectRole role) { this.role = role; }
}