import { create } from "zustand";

import type { User } from "../types";

const storedUser = localStorage.getItem("auth_user");
const parsedUser = storedUser ? (JSON.parse(storedUser) as User) : null;

type AuthState = {
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: parsedUser,
  setAuth: (user) => {
    localStorage.setItem("auth_user", JSON.stringify(user));
    set({ user });
  },
  clearAuth: () => {
    localStorage.removeItem("auth_user");
    Object.keys(localStorage)
      .filter((key) => key.startsWith("chat_session_id_"))
      .forEach((key) => localStorage.removeItem(key));
    set({ user: null });
  },
}));
