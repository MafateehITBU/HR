/*
  Warnings:

  - Changed the type of `leaveType` on the `LeaveRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "LeaveType" ADD VALUE 'PAID_BY_EMPLOYEE';

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "leaveType",
ADD COLUMN     "leaveType" "LeaveType" NOT NULL;
