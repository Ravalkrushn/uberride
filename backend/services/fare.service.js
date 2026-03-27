/**
 * Fare Service - Calculate ride fares based on distance, time, and demand
 */

// Base fare configuration (in currency units)
const FARE_CONFIG = {
  economy: {
    baseFare: 25,
    perKm: 10,
    perMin: 2
  },
  premium: {
    baseFare: 50,
    perKm: 15,
    perMin: 3
  },
  xl: {
    baseFare: 75,
    perKm: 20,
    perMin: 4
  }
};

// Platform fee percentage
const PLATFORM_FEE_PERCENTAGE = 0.15; // 15%

// Service tax percentage
const SERVICE_TAX_PERCENTAGE = 0.05; // 5%

/**
 * Calculate fare for a ride
 * @param {number} distance - Distance in kilometers
 * @param {number} duration - Duration in minutes
 * @param {string} vehicleType - Type of vehicle (economy, premium, xl)
 * @param {number} surgeMultiplier - Surge pricing multiplier (default 1)
 * @returns {object} Fare breakdown
 */
const calculateFare = (distance, duration, vehicleType = 'economy', surgeMultiplier = 1) => {
  try {
    // Validate inputs
    if (distance < 0 || duration < 0) {
      throw new Error('Distance and duration must be non-negative');
    }

    if (!FARE_CONFIG[vehicleType]) {
      throw new Error(`Invalid vehicle type: ${vehicleType}`);
    }

    if (surgeMultiplier < 1 || surgeMultiplier > 3) {
      throw new Error('Surge multiplier must be between 1 and 3');
    }

    const config = FARE_CONFIG[vehicleType];

    // Calculate base fare
    const baseFare = config.baseFare;
    const distanceFare = distance * config.perKm;
    const durationFare = duration * config.perMin;

    // Subtotal before surge
    let subtotal = baseFare + distanceFare + durationFare;

    // Apply surge pricing
    subtotal = subtotal * surgeMultiplier;

    // Calculate fees
    const platformFee = Math.round(subtotal * PLATFORM_FEE_PERCENTAGE * 100) / 100;
    const serviceTax = Math.round(subtotal * SERVICE_TAX_PERCENTAGE * 100) / 100;

    // Total fare
    const totalFare = Math.round((subtotal + platformFee + serviceTax) * 100) / 100;

    return {
      baseFare: Math.round(baseFare * 100) / 100,
      distanceFare: Math.round(distanceFare * 100) / 100,
      durationFare: Math.round(durationFare * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      platformFee,
      serviceTax,
      surgeMultiplier,
      total: totalFare,
      breakdown: {
        baseFare,
        distance: {
          value: distance,
          fare: Math.round(distanceFare * 100) / 100
        },
        duration: {
          value: duration,
          fare: Math.round(durationFare * 100) / 100
        },
        surge: surgeMultiplier > 1 ? surgeMultiplier : null,
        fees: {
          platform: platformFee,
          tax: serviceTax
        }
      }
    };
  } catch (error) {
    throw new Error(`Fare calculation failed: ${error.message}`);
  }
};

/**
 * Calculate surge multiplier based on demand
 * @param {number} rideRequestCount - Number of active ride requests
 * @param {number} availableCaptainCount - Number of available captains
 * @returns {number} Surge multiplier (1-3)
 */
const calculateSurgeMultiplier = (rideRequestCount, availableCaptainCount) => {
  try {
    if (availableCaptainCount <= 0) {
      return 3; // Maximum surge when no captains available
    }

    const ratio = rideRequestCount / availableCaptainCount;

    // Define surge tiers
    if (ratio < 1) {
      return 1; // No surge
    } else if (ratio < 2) {
      return 1.5; // 50% surge
    } else if (ratio < 3) {
      return 2; // 100% surge
    } else {
      return 3; // 200% surge (max)
    }
  } catch (error) {
    console.error('Surge calculation error:', error);
    return 1; // Default to no surge on error
  }
};

/**
 * Apply discount/promo code to fare
 * @param {number} originalFare - Original fare amount
 * @param {object} promoCode - Promo code object with discountType and value
 * @returns {object} Fare with discount applied
 */
const applyPromoCode = (originalFare, promoCode) => {
  try {
    if (!promoCode) {
      return {
        originalFare,
        discountAmount: 0,
        finalFare: originalFare
      };
    }

    let discountAmount = 0;

    if (promoCode.discountType === 'percentage') {
      discountAmount = Math.round((originalFare * promoCode.value) / 100);
    } else if (promoCode.discountType === 'fixed') {
      discountAmount = promoCode.value;
    }

    // Ensure discount doesn't exceed fare
    discountAmount = Math.min(discountAmount, originalFare);

    const finalFare = originalFare - discountAmount;

    return {
      originalFare,
      promoCode: promoCode.code,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalFare: Math.round(finalFare * 100) / 100
    };
  } catch (error) {
    throw new Error(`Promo code application failed: ${error.message}`);
  }
};

/**
 * Calculate captain's earnings from ride fare
 * @param {number} fare - Total ride fare
 * @param {number} platformFeePercentage - Platform fee percentage (default 15%)
 * @returns {number} Amount captain earns
 */
const calculateCaptainEarnings = (fare, platformFeePercentage = 0.15) => {
  const platformFee = fare * platformFeePercentage;
  return Math.round((fare - platformFee) * 100) / 100;
};

module.exports = {
  calculateFare,
  calculateSurgeMultiplier,
  applyPromoCode,
  calculateCaptainEarnings,
  FARE_CONFIG
};
