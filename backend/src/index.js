import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import gmRoutes from "./routes/Employee Management/gmRoutes.js";
import departmentRoutes from "./routes/Employee Management/departmentRoutes.js";
import teamRoutes from "./routes/Employee Management/teamRoutes.js";
import jobtitleRoutes from "./routes/Employee Management/jobtitleRoutes.js";
import employeeRoutes from "./routes/Employee Management/employeeRoutes.js";
import jobPostingRoutes from './routes/Recruitment/jobPostingRoutes.js';
import applicantRoutes from './routes/Recruitment/applicantRoutes.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/gm", gmRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/jobtitles", jobtitleRoutes);
app.use("/api/employees", employeeRoutes);

//job posting routes
app.use('/api/job-postings', jobPostingRoutes);
app.use('/api/applicants', applicantRoutes);
// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});