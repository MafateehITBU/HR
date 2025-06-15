-- CreateTable
CREATE TABLE "CompanyShift" (
    "id" SERIAL NOT NULL,
    "shift" "Shifts" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "companyRulesId" INTEGER NOT NULL,

    CONSTRAINT "CompanyShift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyShift_shift_companyRulesId_key" ON "CompanyShift"("shift", "companyRulesId");

-- AddForeignKey
ALTER TABLE "CompanyShift" ADD CONSTRAINT "CompanyShift_companyRulesId_fkey" FOREIGN KEY ("companyRulesId") REFERENCES "CompanyRules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
