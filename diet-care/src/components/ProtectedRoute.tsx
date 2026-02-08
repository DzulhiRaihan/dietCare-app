import { Navigate } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";

import { useAuth } from "../hooks/useAuth";
import { getMe, refreshSession } from "../services/auth.service";

type ProtectedRouteProps = {
  children: JSX.Element;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, setAuth, clearAuth } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      if (isAuthenticated) {
        if (mounted) setChecking(false);
        return;
      }

      try {
        await refreshSession();
        const user = await getMe();
        if (mounted) {
          setAuth(user);
        }
      } catch (error) {
        if (mounted) {
          clearAuth();
        }
      } finally {
        if (mounted) setChecking(false);
      }
    };

    check();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, setAuth, clearAuth]);

  if (checking) {
    return <div className="p-6 text-sm text-slate-300">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
