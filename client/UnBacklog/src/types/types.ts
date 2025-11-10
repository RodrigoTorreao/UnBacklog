export const roleMap: Map<string, string> = new Map([
  ["DEVELOPER", "Desenvolvedor"],
  ["PRODUCT_OWNER", "Product Owner"],
  ["SCRUM_MASTER", "Scrum Master"],
]);

export interface Associates {
    email: string, 
    role: string
    name: string
    userId: string
}

export const UserStoryPriority  = {
    HIGH: "HIGH", MEDIUM: "MEDIUM", LOW: "LOW"
} as const;

export const  UserStoryStatus = {
    TO_DO: "TO_DO", DOING: "DOING", DONE: "DONE"
} as const;

export type UserStoryPriority = typeof UserStoryPriority[keyof typeof UserStoryPriority];
export type UserStoryStatus = typeof UserStoryStatus[keyof typeof UserStoryStatus];

export interface UserStory {
    id?: string,
    title?:  string,
    description?: string
    priority?: UserStoryPriority,
    status?: UserStoryStatus,
    sprint?: string
}

export interface  ProjectType {
    id?: string;
    name?: string; 
    description?: string;
    associates?: Associates[];
    userStories?: UserStory[];
}