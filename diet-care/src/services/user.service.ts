import api from "./api";
import type { UserProfile } from "../types";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/user/profile");
  return response.data;
};

export const createProfile = async (payload: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.post<UserProfile>("/user/profile", payload);
  return response.data;
};

export const updateProfile = async (payload: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>("/user/profile", payload);
  return response.data;
};
