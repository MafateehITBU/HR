/*
  Warnings:

  - You are about to drop the column `assignedToEmployeeId` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToTeamId` on the `Goal` table. All the data in the column will be lost.
  - Added the required column `assignedTo` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_assignedTo_employee_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_assignedTo_team_fkey";

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "assignedToEmployeeId",
DROP COLUMN "assignedToTeamId",
ADD COLUMN     "assignedTo" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_assignedTo_team_fkey" FOREIGN KEY ("assignedTo") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_assignedTo_employee_fkey" FOREIGN KEY ("assignedTo") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
