const User = require('../models/user.model');
const Captain = require('../models/captain.model');
const ApiResponse = require('../utils/apiResponse');
const { generateToken } = require('../utils/generateToken');
const { generateOTP, hashOTP, getOTPExpiry, compareOTP } = require('../utils/generateOTP');
const { sendOTPSMS } = require('../services/otp.service');
const bcrypt = require('bcrypt');

/**
 * Register new user/rider
 * POST /api/auth/register
 */
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json(
        new ApiResponse(400, null, 'All fields are required', false)
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json(
        new ApiResponse(400, null, 'User already exists with this email or phone', false)
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'rider'
    });

    // Generate token
    const token = generateToken(user._id, 'rider');

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json(
      new ApiResponse(201, { user: userResponse, token }, 'User registered successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Register new captain/driver
 * POST /api/auth/register-captain
 */
exports.registerCaptain = async (req, res, next) => {
  try {
    const { name, email, phone, password, licenseNumber, vehicleDetails } = req.body;

    // Validate input
    if (!name || !email || !phone || !password || !licenseNumber || !vehicleDetails) {
      return res.status(400).json(
        new ApiResponse(400, null, 'All fields are required', false)
      );
    }

    // Check if captain exists
    const existingCaptain = await Captain.findOne({ $or: [{ email }, { phone }, { licenseNumber }] });
    if (existingCaptain) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Captain already exists', false)
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create captain
    const captain = await Captain.create({
      name,
      email,
      phone,
      password: hashedPassword,
      licenseNumber,
      vehicleDetails,
      status: 'pending'
    });

    // Generate token
    const token = generateToken(captain._id, 'captain');

    // Remove password from response
    const captainResponse = captain.toObject();
    delete captainResponse.password;

    return res.status(201).json(
      new ApiResponse(201, { captain: captainResponse, token }, 'Captain registered successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Send OTP to phone number
 * POST /api/auth/send-otp
 */
exports.sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Phone number is required', false)
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const expiresAt = getOTPExpiry();

    // Send via SMS
    await sendOTPSMS(phone, otp);

    // Store OTP in Redis or session (for 10 min)
    // For now, we'll return OTP in response (only for development)
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          phone,
          expiresAt,
          otpHash: hashedOTP,
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        },
        'OTP sent successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP and login
 * POST /api/auth/verify-otp
 */
exports.verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp, userType } = req.body;

    if (!phone || !otp || !userType) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Phone, OTP, and user type are required', false)
      );
    }

    // Verify OTP (in production, verify from Redis/session)
    // For now, accept any 4-digit OTP

    // Find or create user
    const Model = userType === 'captain' ? Captain : User;
    let user = await Model.findOne({ phone });

    if (!user) {
      // Create new user with OTP verification
      user = await Model.create({
        phone,
        role: userType
      });
    }

    // Generate token
    const token = generateToken(user._id, userType);

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json(
      new ApiResponse(200, { user: userResponse, token }, 'OTP verified successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login with email and password
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password, userType = 'rider' } = req.body;

    if (!email || !password) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Email and password are required', false)
      );
    }

    // Find user
    const Model = userType === 'captain' ? Captain : User;
    const user = await Model.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json(
        new ApiResponse(401, null, 'Invalid credentials', false)
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(
        new ApiResponse(401, null, 'Invalid credentials', false)
      );
    }

    // Generate token
    const token = generateToken(user._id, userType);

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json(
      new ApiResponse(200, { user: userResponse, token }, 'Login successful', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
exports.logout = async (req, res, next) => {
  try {
    // Token invalidation would typically happen on client side
    // Or use token blacklist in production

    return res.status(200).json(
      new ApiResponse(200, null, 'Logged out successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh token
 * POST /api/auth/refresh-token
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { userId, userType } = req.user;

    if (!userId || !userType) {
      return res.status(401).json(
        new ApiResponse(401, null, 'Authentication failed', false)
      );
    }

    // Generate new token
    const newToken = generateToken(userId, userType);

    return res.status(200).json(
      new ApiResponse(200, { token: newToken }, 'Token refreshed successfully', true)
    );
  } catch (error) {
    next(error);
  }
};
