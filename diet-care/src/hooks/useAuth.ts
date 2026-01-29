import { useAuthStore } from "../store/auth.store";

export const useAuth = () => {
  const { user, setAuth, clearAuth } = useAuthStore();
  const isAuthenticated = Boolean(user);

  return {
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
  };
};
