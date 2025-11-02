package UnB.UnBacklog.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import UnB.UnBacklog.dto.ProjectUserDTO;
import UnB.UnBacklog.entities.Project;
import UnB.UnBacklog.entities.ProjectUser;


public interface ProjectRepository extends JpaRepository<Project, UUID> {
    @Query("SELECT new UnB.UnBacklog.dto.ProjectUserDTO(u.userId, u.name, u.email, pu.role) " +
        "FROM ProjectUser pu " +
        "JOIN pu.user u " +
        "JOIN pu.project p " +
        "WHERE p.projectId = :projectId")
    List<ProjectUserDTO> findUsersWithRolesByProjectId(@Param("projectId") UUID projectId);

}