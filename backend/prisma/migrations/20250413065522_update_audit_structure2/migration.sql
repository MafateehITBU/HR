-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "policyId" INTEGER,
ADD COLUMN     "regulationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audit" ADD CONSTRAINT "Audit_regulationId_fkey" FOREIGN KEY ("regulationId") REFERENCES "Regulation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
