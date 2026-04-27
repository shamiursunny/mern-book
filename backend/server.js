// Import core libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware: enable CORS so frontend can call backend
app.use(cors());

// Middleware: parse incoming JSON requests
app.use(express.json());

// ==============================
// 🗄️ DATABASE CONNECTION
// ==============================

// Connect to MongoDB using connection string from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected')) // success log
  .catch(err => console.error('MongoDB Error:', err)); // error log

// ==============================
// 📦 IMPORT ROUTES & MIDDLEWARE
// ==============================

const userRoutes = require('./routes/userRoutes');     // CRUD routes
const authRoutes = require('./routes/authRoutes');     // auth routes (login/signup)
const auth = require('./middleware/authMiddleware');   // JWT middleware

// ==============================
// 🚏 ROUTES
// ==============================

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (require valid JWT)
app.use('/api/users', auth, userRoutes);

// ==============================
// 🚀 START SERVER
// ==============================

// Use Render port OR local port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});