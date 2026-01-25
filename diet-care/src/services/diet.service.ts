import api from "./api";
import type { DietPlan } from "../types";

type DietPlanResponse = {
  plan: DietPlan;
};

type CreateDietPlanPayload = {
  targetWeight?: number | null;
};

export const getDietPlan = async (): Promise<DietPlan | null> => {
  const response = await api.get<DietPlanResponse>("/diet-plan");
  return response.data.plan ?? null;
};

export const createDietPlan = async (
  payload: CreateDietPlanPayload = {}
): Promise<DietPlan> => {
  const response = await api.post<DietPlanResponse>("/diet-plan", payload);
  return response.data.plan;
};

// Backward-compatible alias for any existing imports.
export const fetchDietPlan = getDietPlan;
