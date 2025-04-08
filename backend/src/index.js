import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 