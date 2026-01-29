/*
  Warnings:

  - The values [LOW,MEDIUM,HIGH] on the enum `ActivityLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityLevel_new" AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE');
ALTER TABLE "UserProfile" ALTER COLUMN "activityLevel" TYPE "ActivityLevel_new" USING ("activityLevel"::text::"ActivityLevel_new");
ALTER TYPE "ActivityLevel" RENAME TO "ActivityLevel_old";
ALTER TYPE "ActivityLevel_new" RENAME TO "ActivityLevel";
DROP TYPE "public"."ActivityLevel_old";
COMMIT;

-- AlterTable
ALTER TABLE "DietPlan" ADD COLUMN     "targetBmi" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "bmiCurrent" DOUBLE PRECISION;
