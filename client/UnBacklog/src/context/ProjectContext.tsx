import { createContext, useContext, useState, useCallback } from "react";
import { type UserStory, type ProjectType, type Sprint } from "../types/types";

interface ProjectContextType {
  project: ProjectType;
  setProject: (project: ProjectType) => void;
  updateUserStories: (stories: UserStory[]) => void;
  addUserStory: (story: UserStory) => void;
  deleteUserStory: (storyId: string) => void;
  updateSprints: (sprints: Sprint[]) => void;
  addSprint: (sprint: Sprint) => void;
  deleteSprint: (sprintId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ProjectType>({
    associates: [],
    userStories: [],
    sprints: [],
  });

  // --- User Stories ---
  const updateUserStories = useCallback((stories: UserStory[]) => {
    setProject(prev => ({ ...prev, userStories: stories }));
  }, []);

  const addUserStory = useCallback((story: UserStory) => {
    setProject(prev => ({
      ...prev,
      userStories: [...(prev.userStories || []), story],
    }));
  }, []);

  const deleteUserStory = useCallback((storyId: string) => {
    setProject(prev => ({
      ...prev,
      userStories: prev.userStories?.filter(story => story.id !== storyId) || [],
    }));
  }, []);

  // --- Sprints ---
  const updateSprints = useCallback((sprints: Sprint[]) => {
    setProject(prev => ({ ...prev, sprints }));
  }, []);

  const addSprint = useCallback((sprint: Sprint) => {
    setProject(prev => ({
      ...prev,
      sprints: [...(prev.sprints || []), sprint],
    }));
  }, []);

  const deleteSprint = useCallback((sprintId: string) => {
    setProject(prev => ({
      ...prev,
      sprints: prev.sprints?.filter(sprint => sprint.id !== sprintId) || [],
    }));
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        updateUserStories,
        addUserStory,
        deleteUserStory,
        updateSprints,
        addSprint,
        deleteSprint,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject deve ser usado dentro de ProjectProvider");
  return context;
};