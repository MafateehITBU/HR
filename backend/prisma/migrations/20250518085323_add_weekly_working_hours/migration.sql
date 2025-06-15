/*
  Warnings:

  - You are about to drop the column `empId` on the `LeaveBalance` table. All the data in the column will be lost.
  - You are about to drop the column `leaveTaken` on the `LeaveBalance` table. All the data in the column will be lost.
  - Added the required column `endBreak` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startBreak` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `LeaveBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaveType` to the `LeaveBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LeaveBalance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Shifts" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('ANNUAL', 'SICK');

-- DropForeignKey
ALTER TABLE "LeaveBalance" DROP CONSTRAINT "LeaveBalance_empId_fkey";

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "endBreak" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startBreak" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "shift" "Shifts",
ADD COLUMN     "weeklyWorkingHours" INTEGER NOT NULL DEFAULT 50;

-- AlterTable
ALTER TABLE "LeaveBalance" DROP COLUMN "empId",
DROP COLUMN "leaveTaken",
ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employeeId" INTEGER NOT NULL,
ADD COLUMN     "leaveType" "LeaveType" NOT NULL,
ADD COLUMN     "taken" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "accrualRate" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LeaveBalance" ADD CONSTRAINT "LeaveBalance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
