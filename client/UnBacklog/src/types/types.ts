export const roleMap: Map<string, string> = new Map([
  ["DEVELOPER", "Desenvolvedor"],
  ["PRODUCT_OWNER", "Product Owner"],
  ["SCRUM_MASTER", "Scrum Master"],
]);

export interface Associates {
    email: string, 
    role: string
}