-- Add SIDE to MealType enum
ALTER TYPE "MealType" ADD VALUE IF NOT EXISTS 'SIDE';

-- Extend Food model for bilingual names, serving label, meal type, and per-serving macros
ALTER TABLE "Food"
  ADD COLUMN IF NOT EXISTS "nameEn" TEXT,
  ADD COLUMN IF NOT EXISTS "mealType" "MealType",
  ADD COLUMN IF NOT EXISTS "servingLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "calories" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "protein" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "carbs" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "fat" DOUBLE PRECISION;
