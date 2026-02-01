import api from "./api";
import type { ApiResponse, DietPlan } from "../types";

export const getDietPlan = async (): Promise<DietPlan | null> => {
  const response = await api.get<ApiResponse<{ plan: DietPlan }>>("/diet-plan");
  return response.data.data.plan ?? null;
};

export const createDietPlan = async (): Promise<DietPlan> => {
  const response = await api.post<ApiResponse<{ plan: DietPlan }>>("/diet-plan", {});
  return response.data.data.plan;
};

// Backward-compatible alias for any existing imports.
export const fetchDietPlan = getDietPlan;
