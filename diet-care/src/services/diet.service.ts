import type { AxiosResponse } from "axios";

import api from "./api";
import type { DietPlan } from "../types";

type DietPlanResponse = {
  plan: DietPlan;
};

export const fetchDietPlan = (): Promise<AxiosResponse<DietPlanResponse>> =>
  api.get("/diet-plan");
