import type { AxiosResponse } from "axios";

import api from "./api";
import type { User } from "../types";

type AuthPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  user: User;
  token: string;
};

export const login = (payload: AuthPayload): Promise<AxiosResponse<AuthResponse>> =>
  api.post("/auth/login", payload);

export const register = (payload: AuthPayload): Promise<AxiosResponse<AuthResponse>> =>
  api.post("/auth/register", payload);
