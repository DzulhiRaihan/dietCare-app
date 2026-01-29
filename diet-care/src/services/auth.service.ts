import api from "./api";
import type { User } from "../types";

type AuthPayload = {
  email: string;
  password: string;
  name?: string;
};

type AuthResponse = {
  user: User;
};

export const fetchCsrf = async (): Promise<void> => {
  await api.get("/auth/csrf");
};

export const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  await fetchCsrf();
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

export const register = async (payload: AuthPayload): Promise<AuthResponse> => {
  await fetchCsrf();
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<{ user: User }>("/auth/me");
  return response.data.user;
};

export const logout = async (): Promise<void> => {
  await fetchCsrf();
  await api.post("/auth/logout", {});
};
