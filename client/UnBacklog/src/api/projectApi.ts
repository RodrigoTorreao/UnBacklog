import api from "./api";
import { roleMap, type Associates, UserStoryPriority, UserStoryStatus, type UserStory, type Sprint, TaskStatus, TaskPriority} from "../types/types";

interface createProjectBody { 
    name: string,
    description: string,
    associates: Associates[]

}


export const getProjects = () => {
    return api.get("/project");
}

export const createProject = (body: createProjectBody) => {
    return api.post("/project", body);
}

export const getUserStory = (projecId: string) => {
    return api.get(`/project/${projecId}/user-story`);
}

export const createUserStory = (projecId: string, body: UserStory) => {
    return api.post(`/project/${projecId}/user-story`, body);
}

export const deleteUserStoryApi = (projecId: string, userStoryId: string) => {
    return api.delete(`/project/${projecId}/user-story/${userStoryId}`);
}

export const getSprints = (projectId: string) => {
  return api.get(`/project/${projectId}/sprint`);
};

export const createSprint = (projectId: string, body: Sprint) => {
  return api.post(`/project/${projectId}/sprint`, body);
};

export const updateSprint = (projectId: string, sprintId: string, body: Partial<Sprint>) => {
  return api.put(`/project/${projectId}/sprint/${sprintId}`, body);
};

export const deleteSprint = (projectId: string, sprintId: string) => {
  return api.delete(`/project/${projectId}/sprint/${sprintId}`);
};

export const updateUserStory = (projectId: string, userStoryId: string, body: Partial<UserStory> & { sprintId?: string }) => {
  return api.put(`/project/${projectId}/user-story/${userStoryId}`, body);
};

export const getTasks = (sprintId: string) => {
  return api.get(`/project/tasks/${sprintId}`);
};

export const createTask = (sprintId: string, body: {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  userStoryId?: string;
  responsableId?: string;
}) => {
  return api.post(`/project/tasks/${sprintId}`, body);
};