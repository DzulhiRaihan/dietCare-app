import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth.store";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase();
  if (method && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = getCookie("csrf_token");
    if (csrfToken) {
      config.headers = config.headers ?? {};
      config.headers["x-csrf-token"] = csrfToken;
    }
  }
  return config;
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest.headers?.["x-retry"]) {
      try {
        if (!refreshPromise) {
          refreshPromise = api.post("/auth/refresh", {}).then(() => undefined);
        }
        await refreshPromise;
        refreshPromise = null;

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers["x-retry"] = "true";
        return api.request(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        useAuthStore.getState().clearAuth();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
