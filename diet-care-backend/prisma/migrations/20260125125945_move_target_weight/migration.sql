/*
  Warnings:

  - You are about to drop the column `targetWeight` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DietPlan" ADD COLUMN     "targetWeight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "targetWeight",
ADD COLUMN     "currentWeightKg" DOUBLE PRECISION;
