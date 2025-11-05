import api from "./api";
import { roleMap, type Associates} from "../types/types";

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