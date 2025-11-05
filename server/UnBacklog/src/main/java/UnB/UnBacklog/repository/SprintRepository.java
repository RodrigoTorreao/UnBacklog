package UnB.UnBacklog.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import UnB.UnBacklog.entities.Sprint;

public interface SprintRepository extends JpaRepository<Sprint, UUID> {

}
