package UnB.UnBacklog.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import UnB.UnBacklog.entities.UserStory;


public interface UserStoryRepository extends JpaRepository<UserStory, UUID> {

}
