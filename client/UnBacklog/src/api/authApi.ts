import api from "./api";

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const logout = () =>
  api.post("/auth/logout");

export const getUserInfo = () =>
  api.get("/user/me");  

export const register = (email: string, password: string, name: string) =>
  api.post("/auth/register", { email, password, name });
