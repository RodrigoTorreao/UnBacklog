package UnB.UnBacklog.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import UnB.UnBacklog.controller.ProjectController.Associate;
import UnB.UnBacklog.dto.ProjectUserDTO;
import UnB.UnBacklog.entities.Project;
import UnB.UnBacklog.entities.ProjectUser;
import UnB.UnBacklog.entities.User;
import UnB.UnBacklog.repository.ProjectRepository;
import UnB.UnBacklog.repository.UserRepository;
import UnB.UnBacklog.service.ProjectService.ProjectResponse;
import UnB.UnBacklog.service.ProjectService.UserSummary;
import UnB.UnBacklog.util.ProjectRole;
import UnB.UnBacklog.util.Utils;

@Service
public class ProjectService {
    
    ProjectRepository projectRepository;
    UserRepository userRepository;
    Utils utils; 

    public record ProjectResponse(
    UUID id,
    String name,
    String description,
    List<UserSummary> users
    ) {}

    public record UserSummary(
        String name,
        String email,
        UUID userId,
        ProjectRole role
    ) {}

    public ProjectService(ProjectRepository projectRepository, Utils utils, UserRepository userRepository){
        this.projectRepository = projectRepository;
        this.utils = utils;
        this.userRepository = userRepository; 
    }

    public List<ProjectResponse> getProjects(String token){
        UUID userId = utils.getUserIdByToken(token);
        List<Project> projects =  userRepository.findProjectsByUserId(userId); 
        return projects.stream().map(project -> {
            List<UserSummary> users = project.getProjectUsers().stream()
                .map(projectUser -> {
                    User user = projectUser.getUser();
                    return new UserSummary(user.getName(), user.getEmail(), user.getUserId(), projectUser.getRole());
                })
                .toList();

            return new ProjectResponse(
                project.getProjectId(),
                project.getName(),
                project.getDescription(),
                users
            );
        }).toList();

    }

    public void createProject(String token, String name, String description, List<Associate> associates){
        UUID userId = utils.getUserIdByToken(token);
        User user  = userRepository.findById(userId)
            .orElseThrow(() -> new BadCredentialsException("User not found"));

        Project project = new Project(); 
        project.setName(name);
        project.setDescription(description);
        project.setCreatedAt(LocalDateTime.now());

        ProjectUser userRelation = new ProjectUser();
        userRelation.setProject(project);
        userRelation.setUser(user);
        userRelation.setRole(ProjectRole.PRODUCT_OWNER);
        project.getProjectUsers().add(userRelation);
        
        for(Associate associate : associates){
            User userAssociate = userRepository.findByEmail(associate.email())
                    .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado"));
            
            ProjectUser associateRelation = new ProjectUser();
            associateRelation.setProject(project);
            associateRelation.setUser(userAssociate);
            associateRelation.setRole(associate.role());
            project.getProjectUsers().add(associateRelation);
        }
        projectRepository.save(project);
    }
}