package UnB.UnBacklog.entities;

import java.util.UUID;

import UnB.UnBacklog.util.UserStoryPriority;
import UnB.UnBacklog.util.UserStoryStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_story")
public class UserStory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "CHAR(36)", nullable = false, updatable = false)
    private UUID id;

    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private UserStoryPriority priority;

    @Enumerated(EnumType.STRING)
    private UserStoryStatus status;

    @ManyToOne
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UserStoryPriority getPriority() {
        return priority;
    }

    public void setPriority(UserStoryPriority priority) {
        this.priority = priority;
    }

    public UserStoryStatus getStatus() {
        return status;
    }

    public void setStatus(UserStoryStatus status) {
        this.status = status;
    }

    public Sprint getSprint() {
        return sprint;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

}
