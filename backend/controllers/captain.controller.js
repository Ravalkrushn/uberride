const Captain = require('../models/captain.model');
const Ride = require('../models/ride.model');
const Payment = require('../models/payment.model');
const ApiResponse = require('../utils/apiResponse');
const bcrypt = require('bcrypt');

/**
 * Get captain profile
 * GET /api/captain/profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const captain = await Captain.findById(req.user._id).select('-password');

    if (!captain) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Captain not found', false)
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { captain }, 'Profile retrieved successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update captain profile
 * PUT /api/captain/update-profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bankDetails, profilePhoto } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (bankDetails) updates.bankDetails = bankDetails;
    if (profilePhoto) updates.profilePhoto = profilePhoto;

    const captain = await Captain.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    return res.status(200).json(
      new ApiResponse(200, { captain }, 'Profile updated successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle captain online/offline status
 * PUT /api/captain/toggle-online
 */
exports.toggleOnlineStatus = async (req, res, next) => {
  try {
    const { isOnline } = req.body;

    if (typeof isOnline !== 'boolean') {
      return res.status(400).json(
        new ApiResponse(400, null, 'isOnline must be a boolean', false)
      );
    }

    const captain = await Captain.findByIdAndUpdate(
      req.user._id,
      { isOnline },
      { new: true }
    ).select('-password');

    return res.status(200).json(
      new ApiResponse(200, { captain }, `Captain is now ${isOnline ? 'online' : 'offline'}`, true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Upload documents
 * POST /api/captain/upload-documents
 */
exports.uploadDocuments = async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(400).json(
        new ApiResponse(400, null, 'No files uploaded', false)
      );
    }

    const updates = {};

    if (req.files.licenseDocument) {
      updates['documents.license.url'] = req.files.licenseDocument[0].path;
    }

    if (req.files.rcDocument) {
      updates['documents.rc.url'] = req.files.rcDocument[0].path;
    }

    if (req.files.insuranceDocument) {
      updates['documents.insurance.url'] = req.files.insuranceDocument[0].path;
    }

    if (req.files.profilePhoto) {
      updates.profilePhoto = req.files.profilePhoto[0].path;
    }

    const captain = await Captain.findByIdAndUpdate(req.user._id, updates, {
      new: true
    }).select('-password');

    return res.status(200).json(
      new ApiResponse(200, { captain }, 'Documents uploaded successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get captain earnings
 * GET /api/captain/earnings?period=today|week|month
 */
exports.getEarnings = async (req, res, next) => {
  try {
    const { period = 'today' } = req.query;
    let startDate = new Date();

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        return res.status(400).json(
          new ApiResponse(400, null, 'Invalid period', false)
        );
    }

    // Get completed rides for this captain
    const rides = await Ride.find({
      captain: req.user._id,
      status: 'completed',
      createdAt: { $gte: startDate }
    });

    // Get payments for these rides
    const payments = await Payment.find({
      captain: req.user._id,
      status: 'success',
      createdAt: { $gte: startDate }
    });

    const totalEarnings = payments.reduce((sum, payment) => sum + (payment.captainPayout || 0), 0);
    const totalRides = rides.length;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          period,
          totalEarnings,
          totalRides,
          averagePerRide: totalRides > 0 ? Math.round((totalEarnings / totalRides) * 100) / 100 : 0,
          rides
        },
        'Earnings retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get captain performance stats
 * GET /api/captain/performance-stats
 */
exports.getPerformanceStats = async (req, res, next) => {
  try {
    const captain = await Captain.findById(req.user._id);

    const completedRides = await Ride.countDocuments({
      captain: req.user._id,
      status: 'completed'
    });

    const cancelledRides = await Ride.countDocuments({
      captain: req.user._id,
      status: 'cancelled',
      cancelledBy: 'captain'
    });

    const totalEarnings = captain.totalEarnings;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalRides: captain.totalRides,
          completedRides,
          cancelledRides,
          totalEarnings,
          rating: captain.rating.average,
          ratingCount: captain.rating.count,
          acceptanceRate: captain.totalRides > 0 ? Math.round(((captain.totalRides - cancelledRides) / captain.totalRides) * 100) : 0,
          cancellationRate: captain.totalRides > 0 ? Math.round((cancelledRides / captain.totalRides) * 100) : 0
        },
        'Performance stats retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};
