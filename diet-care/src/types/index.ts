export type User = {
  id: string;
  name?: string | null;
  email: string;
};

export type UserProfile = {
  id?: string;
  userId?: string;
  gender?: string | null;
  birthDate?: string | null;
  heightCm?: number | null;
  currentWeightKg?: number | null;
  activityLevel?: "LOW" | "MEDIUM" | "HIGH" | null;
  dietGoal?: "LOSE" | "MAINTAIN" | "GAIN" | null;
  profileCompleted?: boolean | null;
  updatedAt?: string;
};

export type ChatRole = "USER" | "ASSISTANT" | "SYSTEM";

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatSession = {
  sessionId: string;
};

export type ChatMessagePayload = {
  sessionId: string;
  content: string;
};

export type ChatMessageResponse = {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
};

export type DietPlan = {
  id?: string;
  userId?: string;
  dailyCalorieTarget?: number | null;
  proteinTarget?: number | null;
  carbsTarget?: number | null;
  fatTarget?: number | null;
  targetWeight?: number | null;
  planType?: "DEFICIT" | "MAINTENANCE" | "SURPLUS";
  isActive?: boolean;
  createdAt?: string;
};
