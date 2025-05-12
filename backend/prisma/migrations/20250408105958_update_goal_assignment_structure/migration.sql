/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Goal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_assignedTo_employee_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_assignedTo_team_fkey";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "assignedTo",
ADD COLUMN     "assignedToEmployeeId" INTEGER,
ADD COLUMN     "assignedToTeamId" INTEGER;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_assignedToTeamId_fkey" FOREIGN KEY ("assignedToTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_assignedToEmployeeId_fkey" FOREIGN KEY ("assignedToEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
