export type Gender = "male" | "female";

export type CalorieInputs = {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityMultiplier: number;
};

export const getBmi = (weightKg: number, heightCm: number) => {
  const heightMeters = heightCm / 100;
  return weightKg / (heightMeters * heightMeters);
};

export const getBmiCategory = (bmi: number) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export const getBmr = (gender: Gender, weightKg: number, heightCm: number, age: number) => {
  return gender === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
};

export const getDailyCalories = (inputs: CalorieInputs) => {
  const bmr = getBmr(inputs.gender, inputs.weightKg, inputs.heightCm, inputs.age);
  return bmr * inputs.activityMultiplier;
};

export const getIdealBodyWeight = (heightCm: number, gender: Gender) => {
  const heightIn = heightCm / 2.54;
  const base = gender === "male" ? 50 : 45.5;
  const overFiveFeet = Math.max(0, heightIn - 60);
  return base + overFiveFeet * 2.3;
};
