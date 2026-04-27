// Import express
const express = require('express');

// Create router instance (❗ THIS WAS MISSING)
const router = express.Router();

// Import User model
const User = require('../models/User');

// ==============================
// 📖 READ all users (PROTECTED)
// ==============================
router.get('/', async (req, res) => {
  try {
    // Exclude password for security
    const users = await User.find().select('-password');

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// ➕ CREATE user
// ==============================
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();

    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// ✏️ UPDATE user
// ==============================
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================
// ❌ DELETE user
// ==============================
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export router
module.exports = router;