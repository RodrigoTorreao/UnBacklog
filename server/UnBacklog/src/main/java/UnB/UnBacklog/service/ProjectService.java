package UnB.UnBacklog.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import UnB.UnBacklog.controller.ProjectController.Associate;
import UnB.UnBacklog.dto.ProjectUserDTO;
import UnB.UnBacklog.entities.Project;
import UnB.UnBacklog.entities.ProjectUser;
import UnB.UnBacklog.entities.Sprint;
import UnB.UnBacklog.entities.User;
import UnB.UnBacklog.entities.UserStory;
import UnB.UnBacklog.repository.ProjectRepository;
import UnB.UnBacklog.repository.SprintRepository;
import UnB.UnBacklog.repository.UserRepository;
import UnB.UnBacklog.repository.UserStoryRepository;
import UnB.UnBacklog.service.ProjectService.ProjectResponse;
import UnB.UnBacklog.service.ProjectService.UserSummary;
import UnB.UnBacklog.util.ProjectRole;
import UnB.UnBacklog.util.SprintStatus;
import UnB.UnBacklog.util.UserStoryPriority;
import UnB.UnBacklog.util.UserStoryStatus;
import UnB.UnBacklog.util.Utils;

@Service
public class ProjectService {

    private UserStoryRepository userStoryRepository;
    private ProjectRepository projectRepository;
    private UserRepository userRepository;
    private Utils utils; 
    private SprintRepository sprintRepository; 

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

    public ProjectService(ProjectRepository projectRepository, Utils utils, UserRepository userRepository, UserStoryRepository userStoryRepository, SprintRepository sprintRepository){
        this.projectRepository = projectRepository;
        this.utils = utils;
        this.userRepository = userRepository; 
        this.userStoryRepository = userStoryRepository;
        this.sprintRepository = sprintRepository; 
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

    public String createUserStory(String token, String title, String description, UserStoryPriority priority, UserStoryStatus status, String projectId) throws Exception{
        UUID userId = utils.getUserIdByToken(token);
        UUID projectUUID = UUID.fromString(projectId);
        Project project = projectRepository.findById(projectUUID)
            .orElseThrow(() -> new BadCredentialsException("Project not found")); 

        List<ProjectUserDTO> projectUsers = projectRepository.findUsersWithRolesByProjectId(projectUUID);
        Optional<ProjectUserDTO> foundUser = projectUsers.stream().filter(projecUser -> projecUser.getUserId().equals(userId)).findFirst(); 

        if(foundUser.isEmpty() || foundUser.get().getRole() != ProjectRole.PRODUCT_OWNER){
            throw new Exception("Only Product Owners can create user stories");

        }

        UserStory userStory = new UserStory();
        userStory.setTitle(title);
        userStory.setDescription(description);
        userStory.setPriority(priority);
        userStory.setProject(project);
        userStory.setStatus(status);
        UserStory savedUsedStory = userStoryRepository.save(userStory); 

        return savedUsedStory.getId().toString();
    }

    public List<UserStory> getUserStory(String token, String projectId) throws Exception{
        UUID userId = utils.getUserIdByToken(token);
        UUID projectUUID = UUID.fromString(projectId);
        Project project = projectRepository.findById(projectUUID)
            .orElseThrow(() -> new BadCredentialsException("Project not found"));
        boolean hasUser = project.getProjectUsers().stream().anyMatch(projectUser -> projectUser.getUser().getUserId().equals(userId));
        if(!hasUser){
            throw new Exception("Not allowed");
        }
        return project.getUserStories(); 
    }
    public UserStory updateUserStory(
        String token, 
        String projectId, 
        String userStoryId,
        String title, 
        String description, 
        UserStoryPriority priority, 
        UserStoryStatus status,
        String sprintId
    ) throws Exception {

        UUID userId = utils.getUserIdByToken(token);
        UUID projectUUID = UUID.fromString(projectId);
        UUID userStoryUUID = UUID.fromString(userStoryId);
        UUID sprintUUID = UUID.fromString(sprintId);

        List<ProjectUserDTO> projectUsers = projectRepository.findUsersWithRolesByProjectId(projectUUID);
        Optional<ProjectUserDTO> foundUser = projectUsers.stream()
            .filter(projectUser -> projectUser.getUserId().equals(userId))
            .findFirst(); 

        if (foundUser.isEmpty() || foundUser.get().getRole() != ProjectRole.PRODUCT_OWNER) {
            throw new Exception("Only Product Owners can update user stories");
        }
        UserStory userStory = userStoryRepository.findById(userStoryUUID)
            .orElseThrow(() -> new BadCredentialsException("User Story not found"));

        if (!userStory.getProject().getProjectId().equals(projectUUID)) {
            throw new Exception("User Story does not belong to this project");
        }

        if (title != null) userStory.setTitle(title);
        if (description != null) userStory.setDescription(description);
        if (priority != null) userStory.setPriority(priority);
        if (status != null) userStory.setStatus(status);
        if (sprintId != null){
            Sprint sprint = sprintRepository.findById(sprintUUID)
             .orElseThrow(() -> new BadCredentialsException("Sprint not Found"));
            userStory.setSprint(sprint);
        }

        return userStoryRepository.save(userStory);
    }

    public void deleteUserStory(String token, String projectId, String userStoryId) throws Exception{
        UUID userId = utils.getUserIdByToken(token);
        UUID projectUUID = UUID.fromString(projectId);
        UUID userStoryUUID = UUID.fromString(userStoryId);
        
        List<ProjectUserDTO> projectUsers = projectRepository.findUsersWithRolesByProjectId(projectUUID);
        Optional<ProjectUserDTO> foundUser = projectUsers.stream()
            .filter(projectUser -> projectUser.getUserId().equals(userId))
            .findFirst(); 

        if (foundUser.isEmpty() || foundUser.get().getRole() != ProjectRole.PRODUCT_OWNER) {
            throw new Exception("Only Product Owners can update user stories");
        }
        UserStory userStory = userStoryRepository.findById(userStoryUUID)
            .orElseThrow(() -> new BadCredentialsException("User Story not found"));

        if (!userStory.getProject().getProjectId().equals(projectUUID)) {
            throw new Exception("User Story does not belong to this project");
        }

        userStoryRepository.delete(userStory);

    }

    public Sprint createSprint(
        String token, 
        String projectId, 
        String sprintObjective, 
        LocalDateTime startDate, 
        LocalDateTime finishDate, 
        SprintStatus status
    ) throws Exception {

        UUID userId = utils.getUserIdByToken(token);
        UUID projectUUID = UUID.fromString(projectId);
        Project project = projectRepository.findById(projectUUID)
            .orElseThrow(() -> new BadCredentialsException("Project not found"));

        List<ProjectUserDTO> projectUsers = projectRepository.findUsersWithRolesByProjectId(projectUUID);
        Optional<ProjectUserDTO> foundUser = projectUsers.stream()
            .filter(projectUser -> projectUser.getUserId().equals(userId))
            .findFirst(); 

        if (foundUser.isEmpty() || foundUser.get().getRole() != ProjectRole.PRODUCT_OWNER) {
            throw new Exception("Only Product Owners can create sprints");
        }

        if (startDate == null || finishDate == null) {
            status = SprintStatus.PLANNED;
        } 

        else {
            LocalDateTime today = LocalDateTime.now();

            if (startDate.isBefore(today)) {
                throw new Exception("Start date cannot be before today");
            }
            if (finishDate.isBefore(startDate)) {
                throw new Exception("Finish date cannot be before start date");
            }
        }

        if (status == SprintStatus.ACTIVE) {
            Optional<Sprint> activeSprint = project.getSprints().stream()
                .filter(sprint -> sprint.getStatus() == SprintStatus.ACTIVE)
                .findFirst();

            if (activeSprint.isPresent()) {
                Sprint existing = activeSprint.get();
                existing.setStatus(SprintStatus.COMPLETED);
                sprintRepository.save(existing);
            }
        }

        Sprint newSprint = new Sprint();
        newSprint.setObjective(sprintObjective);
        newSprint.setProject(project);
        newSprint.setStartDate(startDate);
        newSprint.setFinishDate(finishDate);
        newSprint.setStatus(status);

        return sprintRepository.save(newSprint);
    }

    public List<Sprint> getSprints(String token, String projectId) throws Exception{
        UUID userId = utils.getUserIdByToken(token);
        UUID projectUUID = UUID.fromString(projectId);
        Project project = projectRepository.findById(projectUUID)
            .orElseThrow(() -> new BadCredentialsException("Project not found"));

        List<ProjectUserDTO> projectUsers = projectRepository.findUsersWithRolesByProjectId(projectUUID);
        Optional<ProjectUserDTO> foundUser = projectUsers.stream()
            .filter(projectUser -> projectUser.getUserId().equals(userId))
            .findFirst(); 

        if (foundUser.isEmpty()) {
            throw new Exception("User not part of project");
        }

        return project.getSprints(); 

    }

    public Sprint updateSprint(
        String token,
        String projectId,
        String sprintId,
        String objective,
        LocalDateTime startDate,
        LocalDateTime finishDate,
        SprintStatus status
    ) throws Exception {
        UUID userId = utils.getUserIdByToken(token);
        UUID projectUUID = UUID.fromString(projectId);
        UUID sprintUUID = UUID.fromString(sprintId);

        // Verifica se o usuário é Product Owner
        List<ProjectUserDTO> projectUsers = projectRepository.findUsersWithRolesByProjectId(projectUUID);
        Optional<ProjectUserDTO> foundUser = projectUsers.stream()
            .filter(p -> p.getUserId().equals(userId))
            .findFirst();

        if (foundUser.isEmpty() || foundUser.get().getRole() != ProjectRole.PRODUCT_OWNER) {
            throw new Exception("Only Product Owners can update sprints");
        }

        Sprint sprint = sprintRepository.findById(sprintUUID)
            .orElseThrow(() -> new BadCredentialsException("Sprint not found"));

        if (!sprint.getProject().getProjectId().equals(projectUUID)) {
            throw new Exception("Sprint does not belong to this project");
        }

        // Atualizações simples
        if (objective != null) sprint.setObjective(objective);
        if (startDate != null) sprint.setStartDate(startDate);
        if (finishDate != null) sprint.setFinishDate(finishDate);

        // Caso o status seja alterado para ACTIVE
        if (status == SprintStatus.ACTIVE && sprint.getStatus() != SprintStatus.ACTIVE) {
            // Desativa qualquer outra sprint ativa
            List<Sprint> sprints = sprint.getProject().getSprints();
            for (Sprint s : sprints) {
                if (!s.getSprintId().equals(sprint.getSprintId()) && s.getStatus() == SprintStatus.ACTIVE) {
                    s.setStatus(SprintStatus.COMPLETED);
                    sprintRepository.save(s);
                }
            }
            sprint.setStatus(SprintStatus.ACTIVE);
        } 
        else if (status != null) {
            sprint.setStatus(status);
        }

        return sprintRepository.save(sprint);
    }

    public void deleteSprint(String token, String projectId, String sprintId) throws Exception {
        UUID userId = utils.getUserIdByToken(token);
        UUID projectUUID = UUID.fromString(projectId);
        UUID sprintUUID = UUID.fromString(sprintId);

        // Verifica se o usuário é Product Owner
        List<ProjectUserDTO> projectUsers = projectRepository.findUsersWithRolesByProjectId(projectUUID);
        Optional<ProjectUserDTO> foundUser = projectUsers.stream()
            .filter(p -> p.getUserId().equals(userId))
            .findFirst();

        if (foundUser.isEmpty() || foundUser.get().getRole() != ProjectRole.PRODUCT_OWNER) {
            throw new Exception("Only Product Owners can delete sprints");
        }

        Sprint sprint = sprintRepository.findById(sprintUUID)
            .orElseThrow(() -> new BadCredentialsException("Sprint not found"));

        if (!sprint.getProject().getProjectId().equals(projectUUID)) {
            throw new Exception("Sprint does not belong to this project");
        }

        if (sprint.getStatus() != SprintStatus.PLANNED) {
            throw new Exception("Only planned sprints can be deleted");
        }

        sprintRepository.delete(sprint);
    }
}   