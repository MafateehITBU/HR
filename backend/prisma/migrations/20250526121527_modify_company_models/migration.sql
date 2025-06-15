/*
  Warnings:

  - You are about to drop the column `email` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `CompanyRules` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyRulesId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Made the column `subscriptionDate` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subscriptionType` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subscriptionStatus` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CompanyRules" DROP CONSTRAINT "CompanyRules_companyId_fkey";

-- DropIndex
DROP INDEX "Company_email_key";

-- DropIndex
DROP INDEX "CompanyRules_companyId_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "email",
DROP COLUMN "password_hash",
DROP COLUMN "phone",
DROP COLUMN "profilePicture",
ADD COLUMN     "companyRulesId" INTEGER,
ALTER COLUMN "subscriptionDate" SET NOT NULL,
ALTER COLUMN "subscriptionType" SET NOT NULL,
ALTER COLUMN "subscriptionStatus" SET NOT NULL;

-- AlterTable
ALTER TABLE "CompanyRules" DROP COLUMN "companyId";

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyRulesId_key" ON "Company"("companyRulesId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_companyRulesId_fkey" FOREIGN KEY ("companyRulesId") REFERENCES "CompanyRules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
