/*
  Warnings:

  - The `type` column on the `Audit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Audit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('REGULATION', 'POLICY');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "type",
ADD COLUMN     "type" "AuditType",
DROP COLUMN "status",
ADD COLUMN     "status" "AuditStatus";
