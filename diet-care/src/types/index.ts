export type User = {
  id: string;
  name: string;
  email: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

export type DietPlan = {
  targetCalories: number;
  meals: string[];
};
