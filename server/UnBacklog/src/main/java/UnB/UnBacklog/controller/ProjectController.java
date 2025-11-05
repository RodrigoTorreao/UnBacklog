package UnB.UnBacklog.controller;

import org.springframework.web.bind.annotation.RestController;

import UnB.UnBacklog.service.ProjectService;
import UnB.UnBacklog.util.ProjectRole;
import UnB.UnBacklog.util.UserStoryPriority;
import UnB.UnBacklog.util.UserStoryStatus;
import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
    public record CreateUserStory(String title, String description, UserStoryPriority priority, UserStoryStatus status, String projectId){}
    public record GetUserStory(String projectId){}


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
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/user-story")
    public ResponseEntity<?> createUserStory(@CookieValue(name = "token", required = false) String token,
     @RequestBody CreateUserStory createUserStory, HttpServletResponse response) {
        try {
            return ResponseEntity.ok(
                projectService.createUserStory(token, createUserStory.title, createUserStory.description, createUserStory.priority, createUserStory.status, createUserStory.projectId)
            );
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/user-story")
    public ResponseEntity<?> createUserStory(@CookieValue(name = "token", required = false) String token,
     @RequestBody GetUserStory getUserStory, HttpServletResponse response) {
        try {
            return ResponseEntity.ok(
                projectService.getUserStory(token, getUserStory.projectId)
            );
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
}
