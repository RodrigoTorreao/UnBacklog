package UnB.UnBacklog.controller;

import org.springframework.web.bind.annotation.RestController;

import UnB.UnBacklog.service.ProjectService;
import UnB.UnBacklog.util.ProjectRole;
import UnB.UnBacklog.util.SprintStatus;
import UnB.UnBacklog.util.TaskPriority;
import UnB.UnBacklog.util.TaskStatus;
import UnB.UnBacklog.util.UserStoryPriority;
import UnB.UnBacklog.util.UserStoryStatus;
import jakarta.servlet.http.HttpServletResponse;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/project")
public class ProjectController {
    private final ProjectService projectService; 

    public ProjectController(ProjectService projectService){
        this.projectService = projectService; 
    }

    public record ErrorResponse(String message) {}
    public record Associate(String email, ProjectRole role){}
    public record CreateRequest(String name, String description, List<Associate> associates){}
    public record CreateUserStory(String title, String description, UserStoryPriority priority, UserStoryStatus status){}
    public record UpdateUserStory(String title, String description, UserStoryPriority priority, UserStoryStatus status, String sprintId){}
    public record CreateSprint(String objective, LocalDateTime startDate, LocalDateTime finishDate, SprintStatus status ){}
    public record UpdateSprint( String objective, LocalDateTime startDate, LocalDateTime finishDate, SprintStatus status) {}
    public record CreateTask(String title,String description,TaskStatus status,TaskPriority priority, String userStoryId, String responsableId) {}
    public record UpdateTask(
    String title,
    String description,
    TaskStatus status,
    TaskPriority priority,
    String userStoryId,  // Opcional - pode ser null para remover associação
    String responsableId // Opcional - pode ser null para remover responsável
) {}

    @GetMapping()
    public ResponseEntity<?> getProjects(@CookieValue(name = "token", required = false) String token, HttpServletResponse response) {
        try {
            return ResponseEntity.ok(projectService.getProjects(token));

        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping()
    public ResponseEntity<?> createProject(@CookieValue(name = "token", required = false) String token,
     @RequestBody CreateRequest createRequest, HttpServletResponse response) {
        try {
            projectService.createProject(token, createRequest.name(), createRequest.description(), createRequest.associates());
            return ResponseEntity.ok().build();

        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("{projectId}/user-story")
    public ResponseEntity<?> createUserStory(@CookieValue(name = "token", required = false) String token,
    @PathVariable String projectId,  @RequestBody CreateUserStory createUserStory, HttpServletResponse response) {
        try {
            return ResponseEntity.ok(
                projectService.createUserStory(token, createUserStory.title, createUserStory.description, createUserStory.priority, createUserStory.status, projectId)
            );
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("{projectId}/user-story")
    public ResponseEntity<?> getUserStory(@CookieValue(name = "token", required = false) String token,
     @PathVariable String projectId,HttpServletResponse response) {
        try {
            return ResponseEntity.ok(
                projectService.getUserStory(token, projectId)
            );
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("{projectId}/user-story/{userStoryId}")
    public ResponseEntity<?> updateUserStory(
        @CookieValue(name = "token", required = false) String token,
        @PathVariable String projectId, 
        @PathVariable String userStoryId,
        @RequestBody UpdateUserStory updateUserStory, 
        HttpServletResponse response) {
        try {
            return ResponseEntity.ok(
                projectService.updateUserStory(
                    token, 
                    projectId, 
                    userStoryId,
                    updateUserStory.title, 
                    updateUserStory.description, 
                    updateUserStory.priority, 
                    updateUserStory.status,
                    updateUserStory.sprintId
                    )
            );
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("{projectId}/user-story/{userStoryId}")
    public ResponseEntity<?> deleteUserStory(
        @CookieValue(name = "token", required = false) String token,
        @PathVariable String projectId, 
        @PathVariable String userStoryId,
        HttpServletResponse response) {
        try {
            projectService.deleteUserStory(token, projectId, userStoryId);
            return ResponseEntity.ok().build();
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("{projectId}/sprint")
    public ResponseEntity<?> createSprint(
        @CookieValue(name = "token", required = false) String token,
        @PathVariable String projectId,    
        @RequestBody CreateSprint sprint
        ) {
        try {
            return ResponseEntity.ok(
                projectService.createSprint(token, projectId, sprint.objective(), sprint.startDate(), sprint.finishDate(), sprint.status())
            );
        } catch (Exception e) {
           return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("{projectId}/sprint")
    public ResponseEntity<?> getSprints(
        @CookieValue(name = "token", required = false) String token,
        @PathVariable String projectId  
        ) {
        try {
            return ResponseEntity.ok(
                projectService.getSprints(token, projectId)
            );
        } catch (Exception e) {
           return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("{projectId}/sprint/{sprintId}")
    public ResponseEntity<?> updateSprint(
        @CookieValue(name = "token", required = false) String token,
        @PathVariable String projectId,
        @PathVariable String sprintId,
        @RequestBody UpdateSprint updateSprint
    ) {
        try {
            return ResponseEntity.ok(
                projectService.updateSprint(
                    token,
                    projectId,
                    sprintId,
                    updateSprint.objective(),
                    updateSprint.startDate(),
                    updateSprint.finishDate(),
                    updateSprint.status()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("{projectId}/sprint/{sprintId}")
    public ResponseEntity<?> deleteSprint(
        @CookieValue(name = "token", required = false) String token,
        @PathVariable String projectId,
        @PathVariable String sprintId
    ) {
        try {
            projectService.deleteSprint(token, projectId, sprintId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("tasks/{sprintId}")
    public ResponseEntity<?> getTasks(@CookieValue(name = "token", required = false) String token, @PathVariable String sprintId) {
        try {
            return ResponseEntity.ok(projectService.getTasks(token, sprintId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("tasks/{sprintId}")
    public ResponseEntity<?> createTask(
        @CookieValue(name = "token", required = false) String token,
        @PathVariable String sprintId,
        @RequestBody CreateTask createTask
    ) {
        try {
            return ResponseEntity.ok(
                projectService.createTask(
                    token,
                    sprintId,
                    createTask.title(),
                    createTask.description(),
                    createTask.status(),
                    createTask.priority(),
                    createTask.userStoryId(),
                    createTask.responsableId()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("tasks/{taskId}")
    public ResponseEntity<?> updateTask(
        @CookieValue(name = "token", required = false) String token,
        @PathVariable String taskId,
        @RequestBody UpdateTask updateTask
    ) {
        try {
            return ResponseEntity.ok(
                projectService.updateTask(
                    token,
                    taskId,
                    updateTask.title(),
                    updateTask.description(),
                    updateTask.status(),
                    updateTask.priority(),
                    updateTask.userStoryId(),
                    updateTask.responsableId()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("tasks/{taskId}")
    public ResponseEntity<?> deleteTask(
        @CookieValue(name = "token", required = false) String token,
        @PathVariable String taskId
    ) {
        try {
            projectService.deleteTask(token, taskId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }


}
