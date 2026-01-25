import { create } from "zustand";

import type { User } from "../types";

const storedToken = localStorage.getItem("auth_token");
const storedUser = localStorage.getItem("auth_user");
const parsedUser = storedUser ? (JSON.parse(storedUser) as User) : null;

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: parsedUser,
  token: storedToken,
  setAuth: (user, token) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(user));
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    set({ user: null, token: null });
  },
}));
