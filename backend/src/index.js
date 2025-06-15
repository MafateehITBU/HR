import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Cron jobs
import yearlyLeaveAccrual from "./utils/yearlyLeaveAccrual.js";
import monthlyLeaveAccrual from "./utils/monthlyLeaveAccrual.js";
import payrollJobs from "./utils/monthlyPayroll.js";

import errorHandler from "./middleware/errorHandler.js";
import companyRoutes from "./routes/Company/companyRoutes.js";
import companyRulesRoutes from "./routes/Company/companyRulesRoutes.js";
import gmRoutes from "./routes/Employee Management/gmRoutes.js";
import departmentRoutes from "./routes/Employee Management/departmentRoutes.js";
import teamRoutes from "./routes/Employee Management/teamRoutes.js";
import jobtitleRoutes from "./routes/Employee Management/jobtitleRoutes.js";
import employeeRoutes from "./routes/Employee Management/employeeRoutes.js";
import jobPostingRoutes from "./routes/Recruitment/jobPostingRoutes.js";
import applicantRoutes from "./routes/Recruitment/applicantRoutes.js";
import interviewRoutes from "./routes/Recruitment/interviewRoutes.js";
import candidateRoutes from "./routes/Recruitment/candidateRoutes.js";
import goalRoutes from "./routes/performance-goals/goalRoutes.js";  
import goaltrackRoutes from "./routes/performance-goals/goaltrackRoutes.js";
import performanceReviewRoutes from "./routes/performance-goals/performanceReviewRoutes.js";
import policyRoutes from "./routes/governance/policyRoutes.js";
import regulationRoutes from "./routes/governance/regulationRoutes.js";
import auditRoutes from "./routes/governance/auditRoutes.js";
import attendanceRoutes from "./routes/Attendance-leave Management/attendanceRoutes.js";
import leaveBalanceRoutes from "./routes/Attendance-leave Management/leaveBalanceRoutes.js";
import leaveRequestRoutes from "./routes/Attendance-leave Management/leaveRequestRoutes.js";
import payrollRoutes from "./routes/Payroll Management/payrollRoutes.js";
import compensationRoutes from "./routes/Payroll Management/compensationRoutes.js";
import payslipRoutes from "./routes/Payroll Management/payslipRouter.js";
import bonusRoutes from "./routes/Payroll Management/bonusRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/companies", companyRoutes);
app.use("/api/company-rules", companyRulesRoutes);
app.use("/api/gm", gmRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/jobtitles", jobtitleRoutes);
app.use("/api/employees", employeeRoutes);

//job posting routes
app.use("/api/job-postings", jobPostingRoutes);
app.use("/api/applicants", applicantRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/candidates", candidateRoutes);

//performance & goals routes
app.use("/api/goals", goalRoutes);
app.use("/api/goaltracks", goaltrackRoutes);
app.use("/api/performanceReviews", performanceReviewRoutes);

//governance routes
app.use("/api/policies", policyRoutes);
app.use("/api/regulations", regulationRoutes);
app.use("/api/audits", auditRoutes);

//attendance & leave routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave-balances", leaveBalanceRoutes);
app.use("/api/leave-requests", leaveRequestRoutes);

// payroll routes
app.use("/api/payroll", payrollRoutes);
app.use("/api/compensation", compensationRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/bonuses", bonusRoutes);

// Error handling middleware
app.use(errorHandler);

// Start cron jobs
yearlyLeaveAccrual();
monthlyLeaveAccrual();
payrollJobs.monthlyPayrollCleanUp();
payrollJobs.monthlyPayroll();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
