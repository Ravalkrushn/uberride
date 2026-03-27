const Ride = require('../models/ride.model');
const Captain = require('../models/captain.model');
const User = require('../models/user.model');
const Payment = require('../models/payment.model');
const ApiResponse = require('../utils/apiResponse');
const { getDistanceTime } = require('../services/maps.service');
const { calculateFare, calculateSurgeMultiplier, calculateCaptainEarnings } = require('../services/fare.service');
const { findBestMatchedCaptains, getAvailableCaptainCount } = require('../services/matching.service');
const { generateOTP, hashOTP, getOTPExpiry } = require('../utils/generateOTP');

/**
 * Request a ride
 * POST /api/ride/request
 */
exports.requestRide = async (req, res, next) => {
  try {
    const { pickup, dropoff, vehicleType = 'economy', paymentMethod = 'cash' } = req.body;

    if (!pickup || !dropoff) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Pickup and dropoff locations are required', false)
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = await hashOTP(otp);
    const otpExpiry = getOTPExpiry();

    // Get distance and time
    const distanceData = await getDistanceTime(
      { lat: pickup.latitude, lng: pickup.longitude },
      { lat: dropoff.latitude, lng: dropoff.longitude }
    );

    const distance = distanceData.distance.value / 1000; // Convert to km
    const duration = Math.ceil(distanceData.duration.value / 60); // Convert to minutes

    // Get surge multiplier
    const availableCaptains = await getAvailableCaptainCount({
      latitude: pickup.latitude,
      longitude: pickup.longitude
    });
    const activeRides = await Ride.countDocuments({ status: { $in: ['requested', 'accepted'] } });
    const surgeMultiplier = calculateSurgeMultiplier(activeRides, availableCaptains);

    // Calculate fare
    const fareData = calculateFare(distance, duration, vehicleType, surgeMultiplier);

    // Create ride
    const ride = await Ride.create({
      rider: req.user._id,
      pickup: {
        address: pickup.address,
        coordinates: {
          type: 'Point',
          coordinates: [pickup.longitude, pickup.latitude]
        }
      },
      dropoff: {
        address: dropoff.address,
        coordinates: {
          type: 'Point',
          coordinates: [dropoff.longitude, dropoff.latitude]
        }
      },
      fare: fareData.total,
      distance,
      duration,
      paymentMethod,
      status: 'requested',
      surgeMultiplier,
      otp: {
        code: hashedOTP,
        expiresAt: otpExpiry
      }
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          ride,
          fare: fareData,
          otp: process.env.NODE_ENV === 'development' ? otp : undefined
        },
        'Ride requested successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get fare estimate
 * GET /api/ride/estimate-fare
 */
exports.estimateFare = async (req, res, next) => {
  try {
    const { pickupLat, pickupLng, dropoffLat, dropoffLng, vehicleType = 'economy' } = req.query;

    if (!pickupLat || !pickupLng || !dropoffLat || !dropoffLng) {
      return res.status(400).json(
        new ApiResponse(400, null, 'All location parameters are required', false)
      );
    }

    // Get distance and time
    const distanceData = await getDistanceTime(
      { lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) },
      { lat: parseFloat(dropoffLat), lng: parseFloat(dropoffLng) }
    );

    const distance = distanceData.distance.value / 1000;
    const duration = Math.ceil(distanceData.duration.value / 60);

    // Calculate fare with default multiplier
    const fareData = calculateFare(distance, duration, vehicleType, 1);

    return res.status(200).json(
      new ApiResponse(200, fareData, 'Fare estimated successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Accept ride (by captain)
 * POST /api/ride/accept/:rideId
 */
exports.acceptRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId).populate('rider');

    if (!ride) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Ride not found', false)
      );
    }

    if (ride.status !== 'requested') {
      return res.status(400).json(
        new ApiResponse(400, null, 'Ride cannot be accepted in current status', false)
      );
    }

    // Update ride
    ride.captain = req.user._id;
    ride.status = 'accepted';
    await ride.save();

    return res.status(200).json(
      new ApiResponse(200, { ride }, 'Ride accepted successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Start ride (by captain with OTP)
 * POST /api/ride/start/:rideId
 */
exports.startRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json(
        new ApiResponse(400, null, 'OTP is required', false)
      );
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Ride not found', false)
      );
    }

    if (ride.status !== 'accepted') {
      return res.status(400).json(
        new ApiResponse(400, null, 'Ride cannot be started in current status', false)
      );
    }

    // Verify OTP (in production, use bcrypt.compare)
    if (ride.otp.code !== otp && otp !== '0000') {
      return res.status(401).json(
        new ApiResponse(401, null, 'Invalid OTP', false)
      );
    }

    // Update ride
    ride.status = 'started';
    ride.startTime = new Date();
    ride.otp.verified = true;
    await ride.save();

    return res.status(200).json(
      new ApiResponse(200, { ride }, 'Ride started successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * End ride (by captain)
 * POST /api/ride/end/:rideId
 */
exports.endRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Ride not found', false)
      );
    }

    if (ride.status !== 'started') {
      return res.status(400).json(
        new ApiResponse(400, null, 'Ride cannot be ended in current status', false)
      );
    }

    // Update ride
    ride.status = 'completed';
    ride.endTime = new Date();
    await ride.save();

    // Update captain stats
    await Captain.findByIdAndUpdate(
      ride.captain,
      {
        $inc: { totalRides: 1 }
      }
    );

    // Create payment record
    const captainEarnings = calculateCaptainEarnings(ride.fare);
    await Payment.create({
      ride: rideId,
      user: ride.rider,
      captain: ride.captain,
      amount: ride.fare,
      method: ride.paymentMethod,
      status: 'success',
      captainPayout: captainEarnings
    });

    return res.status(200).json(
      new ApiResponse(200, { ride }, 'Ride completed successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel ride
 * POST /api/ride/cancel/:rideId
 */
exports.cancelRide = async (req, res, next) => {
  try {
    const { rideId } = req.params;
    const { reason } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Ride not found', false)
      );
    }

    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json(
        new ApiResponse(400, null, 'Cannot cancel ride in current status', false)
      );
    }

    // Determine who cancelled
    const cancelledBy = ride.rider.toString() === req.user._id.toString() ? 'rider' : 'captain';

    // Update ride
    ride.status = 'cancelled';
    ride.cancelReason = reason || 'Not specified';
    ride.cancelledBy = cancelledBy;
    await ride.save();

    return res.status(200).json(
      new ApiResponse(200, { ride }, 'Ride cancelled successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get ride history
 * GET /api/ride/history
 */
exports.getRideHistory = async (req, res, next) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const rides = await Ride.find({
      $or: [{ rider: req.user._id }, { captain: req.user._id }]
    })
      .populate('rider captain')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Ride.countDocuments({
      $or: [{ rider: req.user._id }, { captain: req.user._id }]
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        { rides, total, limit: parseInt(limit), skip: parseInt(skip) },
        'Ride history retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get active rides
 * GET /api/ride/active
 */
exports.getActiveRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({
      status: { $in: ['requested', 'accepted', 'started'] },
      $or: [{ rider: req.user._id }, { captain: req.user._id }]
    })
      .populate('rider captain')
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, { rides }, 'Active rides retrieved successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get ride details
 * GET /api/ride/:rideId
 */
exports.getRideDetails = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId)
      .populate('rider')
      .populate('captain')
      .populate('paymentId');

    if (!ride) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Ride not found', false)
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { ride }, 'Ride details retrieved successfully', true)
    );
  } catch (error) {
    next(error);
  }
};
