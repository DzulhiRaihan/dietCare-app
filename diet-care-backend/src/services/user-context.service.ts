import { ActivityLevel, DietGoal } from "@prisma/client";
import { userRepo } from "../repositories/index.js";
import * as dietPlanRepo from "../repositories/diet-plan.repository.js";

const formatActivity = (level?: ActivityLevel | null) => {
  if (!level) return null;
  return level.toLowerCase().replace(/_/g, " ");
};

const formatGoal = (goal?: DietGoal | null) => {
  if (!goal) return null;
  return goal.toLowerCase();
};

const computeAvgCalories = (logs: Array<{ totalCalories: number | null }>) => {
  const totals = logs.map((log) => log.totalCalories ?? 0).filter((value) => value > 0);
  if (!totals.length) return null;
  const sum = totals.reduce((acc, value) => acc + value, 0);
  return Math.round(sum / totals.length);
};

export type UserContextSummary = {
  profile: {
    gender?: string | null;
    age?: number | null;
    heightCm?: number | null;
    currentWeightKg?: number | null;
    bmiCurrent?: number | null;
    activityLevel?: string | null;
    dietGoal?: string | null;
  } | null;
  plan: {
    dailyCalorieTarget?: number | null;
    proteinTarget?: number | null;
    carbsTarget?: number | null;
    fatTarget?: number | null;
    targetWeight?: number | null;
    targetBmi?: number | null;
    planType?: string | null;
  } | null;
  recent: {
    latestWeightKg?: number | null;
    avgCalories7d?: number | null;
  };
};

export const buildUserContext = async (userId: string): Promise<UserContextSummary> => {
  const [profile, plan, latestWeightLog, calorieLogs] = await Promise.all([
    userRepo.findProfileByUserId(userId),
    dietPlanRepo.findActivePlanByUserId(userId),
    userRepo.findLatestWeightLog(userId),
    userRepo.findRecentCalorieLogs(userId, 7),
  ]);

  const age = profile?.birthDate
    ? new Date().getFullYear() - profile.birthDate.getFullYear()
    : null;

  return {
    profile: profile
      ? {
          gender: profile.gender,
          age,
          heightCm: profile.heightCm,
          currentWeightKg: profile.currentWeightKg ?? latestWeightLog?.weightKg ?? null,
          bmiCurrent: profile.bmiCurrent,
          activityLevel: formatActivity(profile.activityLevel),
          dietGoal: formatGoal(profile.dietGoal),
        }
      : null,
    plan: plan
      ? {
          dailyCalorieTarget: plan.dailyCalorieTarget,
          proteinTarget: plan.proteinTarget,
          carbsTarget: plan.carbsTarget,
          fatTarget: plan.fatTarget,
          targetWeight: plan.targetWeight,
          targetBmi: plan.targetBmi,
          planType: plan.planType?.toLowerCase() ?? null,
        }
      : null,
    recent: {
      latestWeightKg: latestWeightLog?.weightKg ?? null,
      avgCalories7d: computeAvgCalories(calorieLogs),
    },
  };
};
