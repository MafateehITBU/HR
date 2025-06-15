/*
  Warnings:

  - The `status` column on the `LeaveRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('APPROVED', 'REJECTED', 'UNDER_CONSIDERATION');

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "status",
ADD COLUMN     "status" "LeaveRequestStatus" NOT NULL DEFAULT 'UNDER_CONSIDERATION';
