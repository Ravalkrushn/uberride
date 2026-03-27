const User = require('../models/user.model');
const ApiResponse = require('../utils/apiResponse');
const bcrypt = require('bcrypt');

/**
 * Get user profile
 * GET /api/user/profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json(
        new ApiResponse(404, null, 'User not found', false)
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { user }, 'Profile retrieved successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/user/update-profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profilePhoto } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (profilePhoto) updates.profilePhoto = profilePhoto;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json(
        new ApiResponse(400, null, 'No fields to update', false)
      );
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    return res.status(200).json(
      new ApiResponse(200, { user }, 'Profile updated successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 * PUT /api/user/change-password
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json(
        new ApiResponse(400, null, 'All password fields are required', false)
      );
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json(
        new ApiResponse(400, null, 'New passwords do not match', false)
      );
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(
        new ApiResponse(401, null, 'Old password is incorrect', false)
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json(
      new ApiResponse(200, null, 'Password changed successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Add saved address
 * POST /api/user/add-saved-address
 */
exports.addSavedAddress = async (req, res, next) => {
  try {
    const { label, address, latitude, longitude } = req.body;

    if (!label || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json(
        new ApiResponse(400, null, 'All fields are required', false)
      );
    }

    const user = await User.findById(req.user._id);

    if (!user.savedAddresses) {
      user.savedAddresses = [];
    }

    user.savedAddresses.push({
      label,
      address,
      coordinates: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    });

    await user.save();

    return res.status(201).json(
      new ApiResponse(201, { addresses: user.savedAddresses }, 'Address saved successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all saved addresses
 * GET /api/user/saved-addresses
 */
exports.getSavedAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('savedAddresses');

    return res.status(200).json(
      new ApiResponse(200, { addresses: user.savedAddresses || [] }, 'Addresses retrieved successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete account
 * DELETE /api/user/account
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Password is required', false)
      );
    }

    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(
        new ApiResponse(401, null, 'Password is incorrect', false)
      );
    }

    // Delete user
    await User.findByIdAndDelete(req.user._id);

    return res.status(200).json(
      new ApiResponse(200, null, 'Account deleted successfully', true)
    );
  } catch (error) {
    next(error);
  }
};
