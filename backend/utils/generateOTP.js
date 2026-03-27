const crypto = require('crypto');
const bcrypt = require('bcrypt');

/**
 * Generate 4-digit OTP
 * @returns {string} 4-digit OTP code
 */
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Hash OTP for storage
 * @param {string} otp - Plain OTP code
 * @returns {string} Hashed OTP
 */
const hashOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

/**
 * Compare OTP with hashed OTP
 * @param {string} plainOTP - Plain OTP entered by user
 * @param {string} hashedOTP - Hashed OTP stored in DB
 * @returns {boolean} True if OTP matches
 */
const compareOTP = async (plainOTP, hashedOTP) => {
  return bcrypt.compare(plainOTP, hashedOTP);
};

/**
 * Generate OTP expiry time (10 minutes from now)
 * @returns {Date} Expiry timestamp
 */
const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

/**
 * Check if OTP is expired
 * @param {Date} expiryTime - OTP expiry timestamp
 * @returns {boolean} True if expired
 */
const isOTPExpired = (expiryTime) => {
  return new Date() > expiryTime;
};

module.exports = {
  generateOTP,
  hashOTP,
  compareOTP,
  getOTPExpiry,
  isOTPExpired
};
