import api from "./api";
import type { User } from "../types";

type AuthPayload = {
  email: string;
  password: string;
  name?: string;
};

type AuthResponse = {
  user: User;
  token: string;
};

export const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

export const register = async (payload: AuthPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
};
