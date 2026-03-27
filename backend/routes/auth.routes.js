const express = require('express');
const authController = require('../controllers/auth.controller');
const { verifyRider, verifyCaptain } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Auth Routes
 */

// Register routes
router.post('/register', authController.registerUser);
router.post('/register-captain', authController.registerCaptain);

// OTP routes
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);

// Login/Logout
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Refresh token
router.post('/refresh-token', verifyRider, authController.refreshToken);

module.exports = router;
