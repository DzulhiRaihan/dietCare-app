-- AlterTable
ALTER TABLE "NutritionDocument"
  ALTER COLUMN "embedding" TYPE vector(768)
  USING "embedding"::vector(768);
