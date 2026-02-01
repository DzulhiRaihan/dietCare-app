import api from "./api";
import type { ApiResponse, User } from "../types";

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
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", payload);
  return response.data.data;
};

export const register = async (payload: AuthPayload): Promise<AuthResponse> => {
  await fetchCsrf();
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", payload);
  return response.data.data;
};

export const guestLogin = async (): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/guest", {});
  return response.data.data;
};

export const refreshSession = async (): Promise<void> => {
  await api.post<ApiResponse<{ ok: true }>>("/auth/refresh", {});
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
  return response.data.data.user;
};

export const logout = async (): Promise<void> => {
  await fetchCsrf();
  await api.post("/auth/logout", {});
};
