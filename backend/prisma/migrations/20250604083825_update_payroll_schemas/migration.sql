/*
  Warnings:

  - You are about to drop the column `baseSalary` on the `Compensation` table. All the data in the column will be lost.
  - You are about to drop the column `benefits` on the `Compensation` table. All the data in the column will be lost.
  - You are about to drop the column `compensationHistory` on the `Compensation` table. All the data in the column will be lost.
  - The `payPeriod` column on the `Payroll` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `incentiveType` on the `Bonus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `incentivePeriod` on the `Bonus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `amount` to the `Compensation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `benefit` to the `Compensation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PayPeriod" AS ENUM ('MONTHLY', 'WEEKLY');

-- CreateEnum
CREATE TYPE "IncentiveType" AS ENUM ('PERFORMANCE_BONUS', 'SALES_COMMISSION', 'REFERRAL');

-- CreateEnum
CREATE TYPE "IncentivePeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "CompensationBenefit" AS ENUM ('HEALTH_INSURANCE', 'RETIREMENT_CONTRIBUTIONS', 'TRANSPORTATION');

-- AlterTable
ALTER TABLE "Bonus" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "incentiveType",
ADD COLUMN     "incentiveType" "IncentiveType" NOT NULL,
DROP COLUMN "incentivePeriod",
ADD COLUMN     "incentivePeriod" "IncentivePeriod" NOT NULL;

-- AlterTable
ALTER TABLE "Compensation" DROP COLUMN "baseSalary",
DROP COLUMN "benefits",
DROP COLUMN "compensationHistory",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "benefit" "CompensationBenefit" NOT NULL,
ADD COLUMN     "effective" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Payroll" DROP COLUMN "payPeriod",
ADD COLUMN     "payPeriod" "PayPeriod" NOT NULL DEFAULT 'MONTHLY';
