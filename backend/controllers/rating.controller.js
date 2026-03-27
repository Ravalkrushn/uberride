const Rating = require('../models/rating.model');
const Ride = require('../models/ride.model');
const Captain = require('../models/captain.model');
const User = require('../models/user.model');
const ApiResponse = require('../utils/apiResponse');

/**
 * Rate a ride
 * POST /api/rating/rate
 */
exports.rateRide = async (req, res, next) => {
  try {
    const { rideId, stars, tags, comment } = req.body;

    if (!rideId || !stars) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Ride ID and star rating are required', false)
      );
    }

    if (stars < 1 || stars > 5) {
      return res.status(400).json(
        new ApiResponse(400, null, 'Stars must be between 1 and 5', false)
      );
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json(
        new ApiResponse(404, null, 'Ride not found', false)
      );
    }

    // Determine role (rider or captain)
    const isRider = ride.rider.toString() === req.user._id.toString();
    const isCaptain = ride.captain.toString() === req.user._id.toString();

    if (!isRider && !isCaptain) {
      return res.status(403).json(
        new ApiResponse(403, null, 'Only ride participants can rate', false)
      );
    }

    // Check if already rated
    const existingRating = await Rating.findOne({
      ride: rideId,
      ratedBy: req.user._id
    });

    if (existingRating) {
      return res.status(400).json(
        new ApiResponse(400, null, 'You have already rated this ride', false)
      );
    }

    const rating = await Rating.create({
      ride: rideId,
      ratedBy: req.user._id,
      ratedTo: isRider ? ride.captain : ride.rider,
      role: isRider ? 'captain' : 'rider',
      stars,
      tags,
      comment
    });

    // Update captain/user rating
    const Model = isRider ? Captain : User;
    const user = await Model.findById(isRider ? ride.captain : ride.rider);

    const totalRatings = await Rating.countDocuments({
      ratedTo: isRider ? ride.captain : ride.rider
    });

    const avgRating = await Rating.aggregate([
      {
        $match: {
          ratedTo: isRider ? ride.captain._id : ride.rider._id
        }
      },
      {
        $group: {
          _id: null,
          avgStars: { $avg: '$stars' }
        }
      }
    ]);

    if (isRider) {
      await Captain.findByIdAndUpdate(ride.captain, {
        'rating.average': avgRating[0]?.avgStars || 0,
        'rating.count': totalRatings
      });
    } else {
      await User.findByIdAndUpdate(ride.rider, {
        'rating.average': avgRating[0]?.avgStars || 0,
        'rating.count': totalRatings
      });
    }

    return res.status(201).json(
      new ApiResponse(201, { rating }, 'Rating submitted successfully', true)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get my ratings
 * GET /api/rating/my-ratings
 */
exports.getMyRatings = async (req, res, next) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const ratings = await Rating.find({ ratedTo: req.user._id })
      .populate('ratedBy', 'name profilePhoto')
      .populate('ride', 'pickup dropoff distance fare')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Rating.countDocuments({ ratedTo: req.user._id });

    const avgRating = await Rating.aggregate([
      {
        $match: {
          ratedTo: req.user._id
        }
      },
      {
        $group: {
          _id: null,
          avgStars: { $avg: '$stars' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          ratings,
          summary: {
            average: avgRating[0]?.avgStars || 0,
            total: avgRating[0]?.totalRatings || 0
          },
          pagination: { limit: parseInt(limit), skip: parseInt(skip), total }
        },
        'Ratings retrieved successfully',
        true
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get ratings for a specific ride
 * GET /api/rating/ride/:rideId
 */
exports.getRideRatings = async (req, res, next) => {
  try {
    const { rideId } = req.params;

    const ratings = await Rating.find({ ride: rideId })
      .populate('ratedBy', 'name profilePhoto')
      .populate('ratedTo', 'name profilePhoto');

    return res.status(200).json(
      new ApiResponse(200, { ratings }, 'Ride ratings retrieved successfully', true)
    );
  } catch (error) {
    next(error);
  }
};
