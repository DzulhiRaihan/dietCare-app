import { ActivityLevel, DietGoal, type Prisma } from "@prisma/client";
import { HttpError } from "../utils/http-error.js";
import { userRepo } from "../repositories/index.js";

export type UserProfilePayload = {
  gender?: string | null;
  birthDate?: string | Date | null;
  heightCm?: number | null;
  activityLevel?: ActivityLevel | string | null;
  dietGoal?: DietGoal | string | null;
  targetWeight?: number | null;
  profileCompleted?: boolean | null;
};

const parseDate = (value: string | Date | null | undefined, field: string): Date | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, `${field} must be a valid date`);
  }
  return date;
};

const parseNumber = (value: number | null | undefined, field: string): number | null | undefined => {
  if (value === undefined || value === null) return value;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new HttpError(400, `${field} must be a valid number`);
  }
  return value;
};

const parseEnum = <T extends string>(
  value: T | string | null | undefined,
  allowed: readonly T[],
  field: string
): T | null | undefined => {
  if (value === undefined || value === null) return value as null | undefined;
  if (typeof value !== "string") {
    throw new HttpError(400, `${field} must be a string`);
  }
  if (!allowed.includes(value as T)) {
    throw new HttpError(400, `${field} must be one of ${allowed.join(", ")}`);
  }
  return value as T;
};

const parseBoolean = (value: boolean | null | undefined, field: string): boolean | null | undefined => {
  if (value === undefined || value === null) return value;
  if (typeof value !== "boolean") {
    throw new HttpError(400, `${field} must be a boolean`);
  }
  return value;
};

const buildProfileData = (input: UserProfilePayload): Omit<Prisma.UserProfileUncheckedCreateInput, "userId"> => {
  const data: Omit<Prisma.UserProfileUncheckedCreateInput, "userId"> = {};

  if (input.gender !== undefined) data.gender = input.gender;
  const birthDate = parseDate(input.birthDate, "birthDate");
  if (birthDate !== undefined) data.birthDate = birthDate;
  const heightCm = parseNumber(input.heightCm, "heightCm");
  if (heightCm !== undefined) data.heightCm = heightCm;
  const activityLevel = parseEnum(input.activityLevel, Object.values(ActivityLevel), "activityLevel");
  if (activityLevel !== undefined) data.activityLevel = activityLevel;
  const dietGoal = parseEnum(input.dietGoal, Object.values(DietGoal), "dietGoal");
  if (dietGoal !== undefined) data.dietGoal = dietGoal;
  const targetWeight = parseNumber(input.targetWeight, "targetWeight");
  if (targetWeight !== undefined) data.targetWeight = targetWeight;
  const profileCompleted = parseBoolean(input.profileCompleted, "profileCompleted");
  if (profileCompleted !== undefined && profileCompleted !== null) data.profileCompleted = profileCompleted;

  return data;
};

const buildProfileUpdateData = (input: UserProfilePayload): Prisma.UserProfileUpdateInput => {
  const data: Prisma.UserProfileUpdateInput = {};

  if (input.gender !== undefined) data.gender = input.gender;
  const birthDate = parseDate(input.birthDate, "birthDate");
  if (birthDate !== undefined) data.birthDate = birthDate;
  const heightCm = parseNumber(input.heightCm, "heightCm");
  if (heightCm !== undefined) data.heightCm = heightCm;
  const activityLevel = parseEnum(input.activityLevel, Object.values(ActivityLevel), "activityLevel");
  if (activityLevel !== undefined) data.activityLevel = activityLevel;
  const dietGoal = parseEnum(input.dietGoal, Object.values(DietGoal), "dietGoal");
  if (dietGoal !== undefined) data.dietGoal = dietGoal;
  const targetWeight = parseNumber(input.targetWeight, "targetWeight");
  if (targetWeight !== undefined) data.targetWeight = targetWeight;
  const profileCompleted = parseBoolean(input.profileCompleted, "profileCompleted");
  if (profileCompleted !== undefined && profileCompleted !== null) data.profileCompleted = profileCompleted;

  return data;
};

const isEmptyObject = (value: Record<string, unknown>) => Object.keys(value).length === 0;

export const createUserProfile = async (userId: string, payload: UserProfilePayload) => {
  const existing = await userRepo.findProfileByUserId(userId);
  if (existing) {
    throw new HttpError(400, "Profile already exists");
  }

  const data = buildProfileData(payload);

  return userRepo.createProfile({
    userId,
    ...data,
  });
};

export const getUserProfile = async (userId: string) => {
  const profile = await userRepo.findProfileByUserId(userId);
  if (!profile) {
    throw new HttpError(404, "Profile not found");
  }
  return profile;
};

export const updateUserProfile = async (userId: string, payload: UserProfilePayload) => {
  const existing = await userRepo.findProfileByUserId(userId);
  if (!existing) {
    throw new HttpError(404, "Profile not found");
  }

  const data = buildProfileUpdateData(payload);
  if (isEmptyObject(data)) {
    throw new HttpError(400, "No fields provided for update");
  }

  return userRepo.updateProfileByUserId(userId, data);
};
