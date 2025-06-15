/*
  Warnings:

  - You are about to drop the column `endBreak` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `startBreak` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "endBreak",
DROP COLUMN "startBreak",
ADD COLUMN     "breakEndTime" TIMESTAMP(3),
ADD COLUMN     "breakStartTime" TIMESTAMP(3);
