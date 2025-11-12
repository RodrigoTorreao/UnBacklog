import api from "./api";
import { roleMap, type Associates, UserStoryPriority, UserStoryStatus, type UserStory, type Sprint} from "../types/types";

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
