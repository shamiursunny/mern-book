// IMPORT REQUIRED PACKAGES
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// INITIALIZE EXPRESS APP
const app = express();

// MIDDLEWARES

// ✅ Enable CORS (allows frontend to communicate with backend)
app.use(cors());

// ✅ Parse incoming JSON requests (req.body)
app.use(express.json());


// ==========================
// DATABASE CONNECTION
// ==========================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// ==========================
// IMPORT ROUTES & MIDDLEWARE
// ==========================

// User routes (CRUD)
const userRoutes = require('./routes/userRoutes');

// Auth routes (signup/login)
const authRoutes = require('./routes/authRoutes');

// Auth middleware (JWT protection)
const auth = require('./middleware/authMiddleware');


// ==========================
// DEFINE ROUTES
// ==========================

// ✅ PUBLIC ROUTES (no login required)
app.use('/api/auth', authRoutes);

// 🔐 PROTECTED ROUTES (login required)
app.use('/api/users', auth, userRoutes);


// ==========================
// START SERVER
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});