const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user/captain
 * @param {string} id - User/Captain ID
 * @param {string} role - User role (rider/captain/admin)
 * @returns {string} JWT token
 */
const generateToken = (id, role = 'rider') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token data
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
};

/**
 * Get token from request header
 * @param {object} req - Express request object
 * @returns {string|null} Token or null
 */
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenFromHeader
};
