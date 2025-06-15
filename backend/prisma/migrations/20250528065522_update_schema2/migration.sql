/*
  Warnings:

  - Added the required column `approvalEmpId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "approvalEmpId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_approvalEmpId_fkey" FOREIGN KEY ("approvalEmpId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
