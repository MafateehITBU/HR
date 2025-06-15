/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,leaveType]` on the table `LeaveBalance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LeaveBalance_employeeId_leaveType_key" ON "LeaveBalance"("employeeId", "leaveType");
