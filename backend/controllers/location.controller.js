const Captain = require('../models/captain.model');
const ApiResponse = require('../utils/apiResponse');
const { findNearbyCaptains } = require('../services/matching.service');

/**
 * Update captain location
 * POST /api/location/update
 */
exports.updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json(
        new ApiResponse(400, null, 'Valid latitude and longitude are required', false)
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Invalid coordinate values', false)
      );
    }

    const captain = await Captain.findByIdAndUpdate(
      req.user._id,
      {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        lastLocationUpdate: new Date()
      },
      { new: true }
    ).select('-password');

    return res.status(200).json(
      new ApiResponse(200, { captain }, 'Location updated successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get nearby available captains
 * GET /api/location/nearby-captains
 */
exports.getNearbyCaptains = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5000, vehicleType, limit = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Latitude and longitude are required', false)
      );
    }

    const nearby = await findNearbyCaptains(
      {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      parseInt(radius),
      vehicleType,
      parseInt(limit)
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        { captains: nearby, count: nearby.length },
        'Nearby captains retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get captain availability status in area
 * GET /api/location/availability
 */
exports.getAvailability = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Latitude and longitude are required', false)
      );
    }

    const availableCaptains = await Captain.countDocuments({
      isOnline: true,
      status: 'approved',
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        { availableCaptains, radius },
        'Availability retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};
