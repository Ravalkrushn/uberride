/**
 * Global error handler middleware
 * Catches and formats all errors consistently
 * @param {object} err - Error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let success = false;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((error) => error.message);
    message = messages.join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Custom API errors
  if (err.isOperational) {
    return res.status(statusCode).json({
      success,
      message,
      statusCode,
      ...(process.env.NODE_ENV === 'development' && { error: err })
    });
  }

  // Log unexpected errors
  console.error('Unexpected Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // Send generic error in production
  const response = {
    success,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
    statusCode
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = {
      name: err.name,
      message: err.message,
      stack: err.stack
    };
  }

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next middleware
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404).json({
    success: false,
    message: error.message,
    statusCode: 404
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
