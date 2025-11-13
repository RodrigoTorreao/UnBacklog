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
    sprints?: Sprint[];
}

export const SprintStatus = {
  PLANNED: "PLANNED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
} as const;

export type SprintStatus = typeof SprintStatus[keyof typeof SprintStatus];

export interface Sprint {
  id?: string;
  objective: string;
  startDate?: string;
  finishDate?: string;
  status: SprintStatus;
}

export const TaskStatus = {
  TO_DO: "TO_DO",
  DOING: "DOING", 
  DONE: "DONE",
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

export interface Task {
  id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  userStoryId?: string;
  sprintId?: string;
}
