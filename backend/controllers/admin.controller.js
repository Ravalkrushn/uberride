const User = require('../models/user.model');
const Captain = require('../models/captain.model');
const Ride = require('../models/ride.model');
const Payment = require('../models/payment.model');
const ApiResponse = require('../utils/apiResponse');

/**
 * Get dashboard stats
 * GET /api/admin/dashboard-stats
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCaptains = await Captain.countDocuments();
    const totalRides = await Ride.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const cancelledRides = await Ride.countDocuments({ status: 'cancelled' });

    const approvingCaptains = await Captain.countDocuments({ status: 'pending' });
    const suspendedCaptains = await Captain.countDocuments({ status: 'suspended' });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          users: totalUsers,
          captains: totalCaptains,
          rides: {
            total: totalRides,
            completed: completedRides,
            cancelled: cancelledRides
          },
          revenue: totalRevenue[0]?.total || 0,
          captainStatus: {
            pending: approvingCaptains,
            suspended: suspendedCaptains,
            approved: totalCaptains - approvingCaptains - suspendedCaptains
          }
        },
        'Dashboard stats retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return res.status(200).json(
      new ApiResponse(
        200,
        { users, total, limit: parseInt(limit), skip: parseInt(skip) },
        'Users retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Ban user
 * PUT /api/admin/ban-user/:userId
 */
exports.banUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        isBanned: true,
        banReason: reason
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json(
        new ApiResponse(404, null, 'User not found', false)
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { user }, 'User banned successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all captains
 * GET /api/admin/captains
 */
exports.getAllCaptains = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, status, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { licenseNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const captains = await Captain.find(query)
      .select('-password')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Captain.countDocuments(query);

    return res.status(200).json(
      new ApiResponse(
        200,
        { captains, total, limit: parseInt(limit), skip: parseInt(skip) },
        'Captains retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Approve captain
 * PUT /api/admin/approve-captain/:captainId
 */
exports.approveCaptain = async (req, res, next) => {
  try {
    const { captainId } = req.params;

    const captain = await Captain.findByIdAndUpdate(
      captainId,
      { status: 'approved' },
      { new: true }
    ).select('-password');

    if (!captain) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Captain not found', false)
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { captain }, 'Captain approved successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Suspend captain
 * PUT /api/admin/suspend-captain/:captainId
 */
exports.suspendCaptain = async (req, res, next) => {
  try {
    const { captainId } = req.params;
    const { reason } = req.body;

    const captain = await Captain.findByIdAndUpdate(
      captainId,
      {
        status: 'suspended',
        isOnline: false
      },
      { new: true }
    ).select('-password');

    if (!captain) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Captain not found', false)
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { captain }, 'Captain suspended successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all rides
 * GET /api/admin/all-rides
 */
exports.getAllRides = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .populate('rider', 'name email phone')
      .populate('captain', 'name email phone')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Ride.countDocuments(query);

    return res.status(200).json(
      new ApiResponse(
        200,
        { rides, total, limit: parseInt(limit), skip: parseInt(skip) },
        'Rides retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get revenue report
 * GET /api/admin/revenue-report
 */
exports.getRevenueReport = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
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
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const revenue = await Payment.aggregate([
      {
        $match: {
          status: 'success',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          platformFee: { $sum: '$platformFee' },
          captainEarnings: { $sum: '$captainPayout' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          period,
          ...revenue[0]
        },
        'Revenue report retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create promo code
 * POST /api/admin/create-promo
 */
exports.createPromoCode = async (req, res, next) => {
  try {
    const { code, discountType, value, maxUsage, expiryDate } = req.body;

    if (!code || !discountType || !value) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Code, discount type, and value are required', false)
      );
    }

    // In production, store promos in database
    // For now, return success response

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          code,
          discountType,
          value,
          maxUsage,
          expiryDate
        },
        'Promo code created successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};
