package UnB.UnBacklog.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import UnB.UnBacklog.entities.Project;
import UnB.UnBacklog.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email); 
    
    @Query("SELECT pu.project FROM ProjectUser pu WHERE pu.user.userId = :userId")
    List<Project> findProjectsByUserId(@Param("userId") UUID userId);
} 
