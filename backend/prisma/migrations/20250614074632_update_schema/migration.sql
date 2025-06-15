-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_companyRulesId_fkey";

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_companyRulesId_fkey" FOREIGN KEY ("companyRulesId") REFERENCES "CompanyRules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
