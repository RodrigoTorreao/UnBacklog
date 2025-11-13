package UnB.UnBacklog.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import UnB.UnBacklog.entities.Task;

public interface TaskRepository extends JpaRepository<Task, UUID> {

}
