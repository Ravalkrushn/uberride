const { verifyToken, getTokenFromHeader } = require('../utils/generateToken');
const User = require('../models/user.model');
const Captain = require('../models/captain.model');

/**
 * Verify JWT and attach user to request
 * @param {function} userModel - Mongoose model to query (User or Captain)
 * @returns {function} Express middleware function
 */
const verifyAuth = (userModel) => {
  return async (req, res, next) => {
    try {
      const token = getTokenFromHeader(req);

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided',
          statusCode: 401
        });
      }

      const decoded = verifyToken(token);
      const user = await userModel.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
          statusCode: 401
        });
      }

      req.user = user;
      req.userId = decoded.id;
      req.role = decoded.role;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Token verification failed',
        statusCode: 401
      });
    }
  };
};

/**
 * Verify rider/user authentication
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware
 */
const verifyRider = verifyAuth(User);

/**
 * Verify captain authentication
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware
 */
const verifyCaptain = verifyAuth(Captain);

module.exports = {
  verifyRider,
  verifyCaptain,
  verifyAuth
};
