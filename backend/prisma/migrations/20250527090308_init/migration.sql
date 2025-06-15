/*
  Warnings:

  - Added the required column `companyID` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Applicant" DROP CONSTRAINT "Applicant_jobPostingId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_empId_fkey";

-- DropForeignKey
ALTER TABLE "Bonus" DROP CONSTRAINT "Bonus_empId_fkey";

-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_companyRulesId_fkey";

-- DropForeignKey
ALTER TABLE "Compensation" DROP CONSTRAINT "Compensation_empId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_depID_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_jobTitleID_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_teamID_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_assignedToEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_assignedToTeamId_fkey";

-- DropForeignKey
ALTER TABLE "GoalTrack" DROP CONSTRAINT "GoalTrack_goalId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "JobPosting" DROP CONSTRAINT "JobPosting_jobTitleId_fkey";

-- DropForeignKey
ALTER TABLE "JobPostingTrack" DROP CONSTRAINT "JobPostingTrack_jobPostingId_fkey";

-- DropForeignKey
ALTER TABLE "JobTitle" DROP CONSTRAINT "JobTitle_depID_fkey";

-- DropForeignKey
ALTER TABLE "LeaveBalance" DROP CONSTRAINT "LeaveBalance_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_empId_fkey";

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_empId_fkey";

-- DropForeignKey
ALTER TABLE "Payslip" DROP CONSTRAINT "Payslip_empId_fkey";

-- DropForeignKey
ALTER TABLE "Payslip" DROP CONSTRAINT "Payslip_payrollId_fkey";

-- DropForeignKey
ALTER TABLE "PerformanceReview" DROP CONSTRAINT "PerformanceReview_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "PerformanceReview" DROP CONSTRAINT "PerformanceReview_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_depId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_teamLead_fkey";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "companyID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "JobPosting" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_companyRulesId_fkey" FOREIGN KEY ("companyRulesId") REFERENCES "CompanyRules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_depID_fkey" FOREIGN KEY ("depID") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_jobTitleID_fkey" FOREIGN KEY ("jobTitleID") REFERENCES "JobTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobTitle" ADD CONSTRAINT "JobTitle_depID_fkey" FOREIGN KEY ("depID") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_teamLead_fkey" FOREIGN KEY ("teamLead") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_depId_fkey" FOREIGN KEY ("depId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosting" ADD CONSTRAINT "JobPosting_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPostingTrack" ADD CONSTRAINT "JobPostingTrack_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveBalance" ADD CONSTRAINT "LeaveBalance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compensation" ADD CONSTRAINT "Compensation_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bonus" ADD CONSTRAINT "Bonus_empId_fkey" FOREIGN KEY ("empId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_assignedToTeamId_fkey" FOREIGN KEY ("assignedToTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_assignedToEmployeeId_fkey" FOREIGN KEY ("assignedToEmployeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalTrack" ADD CONSTRAINT "GoalTrack_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReview" ADD CONSTRAINT "PerformanceReview_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceReview" ADD CONSTRAINT "PerformanceReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
