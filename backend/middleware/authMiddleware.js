// IMPORT JWT
const jwt = require('jsonwebtoken');

// AUTH MIDDLEWARE FUNCTION
function auth(req, res, next) {

  // ✅ STEP 1: Get token from header
  // Supports both:
  // Authorization: Bearer <token>
  // Authorization: <token>
  let token = req.header('Authorization');

  // ❌ No token found
  if (!token) {
    return res.status(401).json({ error: 'No token, access denied' });
  }

  // ✅ STEP 2: Remove "Bearer " if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  try {
    // ✅ STEP 3: Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ STEP 4: Attach user ID to request object
    req.user = decoded.id;

    // ✅ STEP 5: Continue to next middleware/route
    next();

  } catch (err) {
    // ❌ Invalid or expired token
    return res.status(400).json({ error: 'Invalid token' });
  }
}

// EXPORT MIDDLEWARE
module.exports = auth;