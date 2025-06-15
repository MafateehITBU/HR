/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "subscriptionDate" DROP NOT NULL,
ALTER COLUMN "subscriptionType" DROP NOT NULL,
ALTER COLUMN "subscriptionStatus" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");
