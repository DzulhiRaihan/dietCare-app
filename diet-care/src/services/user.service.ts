import api from "./api";
import type { ApiResponse, UserProfile } from "../types";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<ApiResponse<UserProfile>>("/user/profile");
  return response.data.data;
};

export const createProfile = async (payload: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.post<ApiResponse<UserProfile>>("/user/profile", payload);
  return response.data.data;
};

export const updateProfile = async (payload: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.patch<ApiResponse<UserProfile>>("/user/profile", payload);
  return response.data.data;
};
