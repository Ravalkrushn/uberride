/**
 * Verify admin role
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware
 */
const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        statusCode: 401
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
        statusCode: 403
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Role verification failed',
      statusCode: 500
    });
  }
};

/**
 * Verify specific role
 * @param {array} roles - Allowed roles
 * @returns {function} Express middleware function
 */
const verifyRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
          statusCode: 401
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Only ${roles.join(', ')} can access this resource`,
          statusCode: 403
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Role verification failed',
        statusCode: 500
      });
    }
  };
};

module.exports = {
  verifyAdmin,
  verifyRole
};
