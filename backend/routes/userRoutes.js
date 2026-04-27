// READ all users (PROTECTED)
router.get('/', async (req, res) => {
  try {
    // Exclude password field for security
    const users = await User.find().select('-password');

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});