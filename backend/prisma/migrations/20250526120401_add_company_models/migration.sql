-- AlterEnum
ALTER TYPE "LeaveType" ADD VALUE 'LEAVE';

-- CreateTable
CREATE TABLE "CompanyRules" (
    "id" SERIAL NOT NULL,
    "sickLeaveDays" INTEGER NOT NULL,
    "annualLeaveDays" INTEGER NOT NULL,
    "leavesDays" INTEGER NOT NULL,
    "leaveAccural" DOUBLE PRECISION NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profilePicture" TEXT,
    "subscriptionDate" TIMESTAMP(3),
    "subscriptionType" TEXT,
    "subscriptionStatus" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyRules_companyId_key" ON "CompanyRules"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- AddForeignKey
ALTER TABLE "CompanyRules" ADD CONSTRAINT "CompanyRules_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
