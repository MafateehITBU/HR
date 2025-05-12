/*
  Warnings:

  - You are about to drop the column `challaenges` on the `GoalTrack` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GoalTrack" DROP COLUMN "challaenges",
ADD COLUMN     "challenges" TEXT[];
