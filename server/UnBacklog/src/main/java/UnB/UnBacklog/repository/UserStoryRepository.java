package UnB.UnBacklog.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;


public interface UserStoryRepository extends JpaRepository<UserRepository, UUID> {

}
