const Captain = require('../models/captain.model');

/**
 * Find nearby available captains using geospatial queries
 * @param {object} coordinates - Rider's coordinates {latitude, longitude}
 * @param {number} radiusInMeters - Search radius (default 5km)
 * @param {string} vehicleType - Desired vehicle type (optional)
 * @param {number} limit - Maximum captains to return (default 10)
 * @returns {Promise<array>} Array of nearby captains
 */
const findNearbyCaptains = async (coordinates, radiusInMeters = 5000, vehicleType = null, limit = 10) => {
  try {
    // Validate coordinates
    if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
      throw new Error('Invalid coordinates format');
    }

    const query = {
      isOnline: true,
      status: 'approved',
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [coordinates.longitude, coordinates.latitude]
          },
          $maxDistance: radiusInMeters
        }
      }
    };

    // Add vehicle type filter if specified
    if (vehicleType) {
      query['vehicleDetails.type'] = vehicleType;
    }

    const captains = await Captain.find(query)
      .select(
        'name email phone profilePhoto vehicleDetails rating totalRides currentLocation isOnline'
      )
      .limit(limit)
      .lean();

    return captains.map((captain) => ({
      id: captain._id,
      name: captain.name,
      rating: captain.rating.average,
      rideCount: captain.totalRides,
      vehicleType: captain.vehicleDetails.type,
      vehicleModel: captain.vehicleDetails.model,
      vehicleColor: captain.vehicleDetails.color,
      licensePlate: captain.vehicleDetails.plate,
      coordinates: captain.currentLocation.coordinates
    }));
  } catch (error) {
    console.error('Error finding nearby captains:', error);
    throw new Error(`Failed to find nearby captains: ${error.message}`);
  }
};

/**
 * Find best-matched captains with filters
 * @param {object} coordinates - Rider's coordinates
 * @param {object} options - Search options (radius, vehicleType, minRating, etc.)
 * @returns {Promise<array>} Sorted array of matched captains
 */
const findBestMatchedCaptains = async (coordinates, options = {}) => {
  try {
    const {
      radius = 5000,
      vehicleType = null,
      minRating = 3.5,
      maxDistance = 10000,
      limit = 10
    } = options;

    const query = {
      isOnline: true,
      status: 'approved',
      'rating.average': { $gte: minRating },
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [coordinates.longitude, coordinates.latitude]
          },
          $maxDistance: Math.min(radius, maxDistance)
        }
      }
    };

    if (vehicleType) {
      query['vehicleDetails.type'] = vehicleType;
    }

    const captains = await Captain.find(query)
      .select('name email phone profilePhoto vehicleDetails rating totalRides currentLocation')
      .sort({ 'rating.average': -1, totalRides: -1 })
      .limit(limit)
      .lean();

    return captains;
  } catch (error) {
    console.error('Error finding best-matched captains:', error);
    throw new Error(`Failed to find matched captains: ${error.message}`);
  }
};

/**
 * Find captain by ID
 * @param {string} captainId - Captain MongoDB ID
 * @returns {Promise<object>} Captain details
 */
const findCaptainById = async (captainId) => {
  try {
    if (!captainId) {
      throw new Error('Captain ID is required');
    }

    const captain = await Captain.findById(captainId).select('-password');

    if (!captain) {
      throw new Error('Captain not found');
    }

    return captain;
  } catch (error) {
    console.error('Error finding captain:', error);
    throw new Error(`Failed to find captain: ${error.message}`);
  }
};

/**
 * Get available captains count in an area
 * @param {object} coordinates - Area coordinates
 * @param {number} radiusInMeters - Search radius
 * @returns {Promise<number>} Count of available captains
 */
const getAvailableCaptainCount = async (coordinates, radiusInMeters = 5000) => {
  try {
    const count = await Captain.countDocuments({
      isOnline: true,
      status: 'approved',
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [coordinates.longitude, coordinates.latitude]
          },
          $maxDistance: radiusInMeters
        }
      }
    });

    return count;
  } catch (error) {
    console.error('Error getting captain count:', error);
    return 0;
  }
};

/**
 * Calculate distance from rider to captain using coordinates
 * @param {array} riderCoords - Rider coordinates [lng, lat]
 * @param {array} captainCoords - Captain coordinates [lng, lat]
 * @returns {number} Distance in meters (approximate)
 */
const calculateDistance = (riderCoords, captainCoords) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (captainCoords[1] * Math.PI) / 180;
  const φ2 = (riderCoords[1] * Math.PI) / 180;
  const Δφ = ((riderCoords[1] - captainCoords[1]) * Math.PI) / 180;
  const Δλ = ((riderCoords[0] - captainCoords[0]) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

module.exports = {
  findNearbyCaptains,
  findBestMatchedCaptains,
  findCaptainById,
  getAvailableCaptainCount,
  calculateDistance
};
