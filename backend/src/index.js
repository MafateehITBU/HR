const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const errorHandler = require('./middleware/errorHandler');
const userRoutes = require('./routes/userRoutes');

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
//Rout


// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 