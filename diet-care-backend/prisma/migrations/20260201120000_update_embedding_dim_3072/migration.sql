-- AlterTable
ALTER TABLE "NutritionDocument"
  ALTER COLUMN "embedding" TYPE vector(3072)
  USING "embedding"::vector(3072);

-- AlterTable
ALTER TABLE "QueryEmbeddingCache"
  ALTER COLUMN "embedding" TYPE vector(3072)
  USING "embedding"::vector(3072);
