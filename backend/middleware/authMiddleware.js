// Import JWT library
const jwt = require('jsonwebtoken');

// Authentication middleware
function auth(req, res, next) {

  // Get token from Authorization header
  // Expected format: "Bearer <token>"
  const authHeader = req.header('Authorization');

  // If no header → deny access
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, access denied' });
  }

  // Remove "Bearer " prefix
  const token = authHeader.replace('Bearer ', '');

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to request
    req.user = decoded.id;

    // Continue to next middleware/route
    next();

  } catch (err) {
    // Invalid token
    res.status(400).json({ error: 'Invalid token' });
  }
}

// Export middleware
module.exports = auth;