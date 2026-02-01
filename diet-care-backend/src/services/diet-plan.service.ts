import { ActivityLevel, DietGoal, PlanType } from "@prisma/client";
import { HttpError } from "../utils/http-error.js";
import { userRepo } from "../repositories/index.js";
import * as dietPlanRepo from "../repositories/diet-plan.repository.js";

export type CreateDietPlanPayload = Record<string, never>;

const activityMultiplier: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
  EXTRA_ACTIVE: 2.0,
};

const goalAdjustments: Record<DietGoal, number> = {
  LOSE: -500,
  MAINTAIN: 0,
  GAIN: 300,
};

const goalPlanType: Record<DietGoal, PlanType> = {
  LOSE: PlanType.DEFICIT,
  MAINTAIN: PlanType.MAINTENANCE,
  GAIN: PlanType.SURPLUS,
};

const proteinMultiplier: Record<DietGoal, number> = {
  LOSE: 1.6,
  MAINTAIN: 1.4,
  GAIN: 1.8,
};

const normalizeGender = (value?: string | null) => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (["male", "m", "man"].includes(normalized)) return "male";
  if (["female", "f", "woman", "girl"].includes(normalized)) return "female";
  return null;
};

const calculateAge = (birthDate: Date) => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
};

const clampCalories = (calories: number) => Math.round(calories);

export const createDietPlan = async (userId: string, payload: CreateDietPlanPayload = {}) => {
  const profile = await userRepo.findProfileByUserId(userId);
  if (!profile) {
    throw new HttpError(404, "Profile not found");
  }

  const gender = normalizeGender(profile.gender);
  if (!gender) {
    throw new HttpError(400, "Gender is required to calculate diet plan");
  }
  if (!profile.birthDate) {
    throw new HttpError(400, "Birth date is required to calculate diet plan");
  }
  if (!profile.heightCm) {
    throw new HttpError(400, "Height is required to calculate diet plan");
  }
  if (!profile.currentWeightKg) {
    throw new HttpError(400, "Current weight is required to calculate diet plan");
  }
  if (!profile.activityLevel) {
    throw new HttpError(400, "Activity level is required to calculate diet plan");
  }
  if (!profile.dietGoal) {
    throw new HttpError(400, "Diet goal is required to calculate diet plan");
  }

  const age = calculateAge(profile.birthDate);
  const bmr =
    gender === "male"
      ? 10 * profile.currentWeightKg + 6.25 * profile.heightCm - 5 * age + 5
      : 10 * profile.currentWeightKg + 6.25 * profile.heightCm - 5 * age - 161;

  const tdee = bmr * activityMultiplier[profile.activityLevel];
  const targetCalories = clampCalories(tdee + goalAdjustments[profile.dietGoal]);

  const proteinTarget = Math.round(profile.currentWeightKg * proteinMultiplier[profile.dietGoal]);
  const fatTarget = Math.round(profile.currentWeightKg * 0.8);
  const remainingCalories = targetCalories - proteinTarget * 4 - fatTarget * 9;
  const carbsTarget = Math.max(0, Math.round(remainingCalories / 4));

  await dietPlanRepo.deactivatePlansByUserId(userId);

  const heightM = profile.heightCm / 100;
  const currentBmi =
    profile.bmiCurrent ?? Math.round((profile.currentWeightKg / (heightM * heightM)) * 10) / 10;

  const targetBmi = (() => {
    if (profile.dietGoal === DietGoal.MAINTAIN) return currentBmi;
    if (profile.dietGoal === DietGoal.LOSE) return Math.min(currentBmi, 22.5);
    return Math.max(currentBmi, 23.5);
  })();

  const targetWeight = Math.round(targetBmi * heightM * heightM * 10) / 10;

  const plan = await dietPlanRepo.createPlan({
    user: { connect: { id: userId } },
    dailyCalorieTarget: targetCalories,
    proteinTarget,
    carbsTarget,
    fatTarget,
    planType: goalPlanType[profile.dietGoal],
    targetWeight,
    targetBmi,
    isActive: true,
  });

  return { plan };
};

export const getActiveDietPlan = async (userId: string) => {
  const plan = await dietPlanRepo.findActivePlanByUserId(userId);
  if (!plan) {
    throw new HttpError(404, "Diet plan not found");
  }
  return { plan };
};
