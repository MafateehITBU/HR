/*
  Warnings:

  - You are about to drop the column `candidateId` on the `Interview` table. All the data in the column will be lost.
  - Added the required column `applicantId` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_candidateId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "candidateId",
ADD COLUMN     "applicantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
