import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const isAuthenticated = Boolean(token);

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    clearAuth,
  };
};
