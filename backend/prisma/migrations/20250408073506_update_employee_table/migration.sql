/*
  Warnings:

  - You are about to drop the column `approvingManagerId` on the `Attendance` table. All the data in the column will be lost.
  - The `clockInMethod` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ClockInMethod" AS ENUM ('FINGERPRINT', 'FACE_RECOGNITION', 'MANUAL', 'RFID', 'MOBILEAPP');

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "approvingManagerId",
DROP COLUMN "clockInMethod",
ADD COLUMN     "clockInMethod" "ClockInMethod";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "profilePicture" TEXT;
