import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import employeeRoutes from "./routes/employeeRoutes.js";
// ... other imports

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/employees", employeeRoutes);
// ... other routes

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
