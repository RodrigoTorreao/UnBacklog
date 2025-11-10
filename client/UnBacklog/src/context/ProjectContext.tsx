import { createContext, useContext, useState } from "react";
import { type UserStory, type ProjectType } from "../types/types";

interface ProjectContextType {
  project: ProjectType;
  setProject: (project: ProjectType) => void;
  updateUserStories: (stories: UserStory[]) => void;
  addUserStory: (story: UserStory) => void;
  deleteUserStory: (storyId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ProjectType>({
    associates: [],
    userStories: [],
  });

  const updateUserStories = (stories: UserStory[]) => {
    setProject(prev => ({ ...prev, userStories: stories }));
  };

  const addUserStory = (story: UserStory) => {
    setProject(prev => ({
      ...prev,
      userStories: [...(prev.userStories || []), story],
    }));
  };

  const deleteUserStory = (storyId: string) => {
    setProject(prev => ({
      ...prev,
      userStories: prev.userStories?.filter(story => story.id !== storyId) || [],
    }));
  };

  return (
    <ProjectContext.Provider value={{ project, setProject, updateUserStories, addUserStory, deleteUserStory }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject deve ser usado dentro de ProjectProvider");
  return context;
};
