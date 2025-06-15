/*
  Warnings:

  - You are about to drop the column `leaveAccural` on the `CompanyRules` table. All the data in the column will be lost.
  - Added the required column `maxCarryOverDays` to the `CompanyRules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyRules" DROP COLUMN "leaveAccural",
ADD COLUMN     "maxCarryOverDays" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "LeaveBalance" ALTER COLUMN "entitlement" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "taken" SET DEFAULT 0,
ALTER COLUMN "taken" SET DATA TYPE DOUBLE PRECISION;
