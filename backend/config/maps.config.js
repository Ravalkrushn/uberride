const GoogleMapsAPI = require('@google/maps');

/**
 * Initialize Google Maps Client
 */
const mapsClient = GoogleMapsAPI.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise,
  rate: {
    limit: 100,
    interval: 100,
    delay: 10
  }
});

/**
 * Validate Google Maps API Key
 */
const validateMapsKey = async () => {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new Error('GOOGLE_MAPS_API_KEY is not set in environment variables');
    }

    // Test geocoding
    const result = await mapsClient.geocode({ address: 'New York' }).asPromise();

    if (result.json.status === 'OK') {
      console.log('Google Maps API key is valid');
      return true;
    } else {
      throw new Error(`Google Maps API error: ${result.json.status}`);
    }
  } catch (error) {
    console.error('Google Maps validation error:', error.message);
    return false;
  }
};

/**
 * Get geocoding results
 * @param {string} address - Address to geocode
 * @returns {Promise<object>} Geocoding result
 */
const geocode = async (address) => {
  try {
    const result = await mapsClient.geocode({ address }).asPromise();
    return result.json;
  } catch (error) {
    throw new Error(`Geocoding error: ${error.message}`);
  }
};

/**
 * Get reverse geocoding (coordinates to address)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<object>} Reverse geocoding result
 */
const reverseGeocode = async (lat, lng) => {
  try {
    const result = await mapsClient
      .reverseGeocode({ latlng: `${lat},${lng}` })
      .asPromise();
    return result.json;
  } catch (error) {
    throw new Error(`Reverse geocoding error: ${error.message}`);
  }
};

/**
 * Get distance between two points
 * @param {string} origin - Origin address or coordinates
 * @param {string} destination - Destination address or coordinates
 * @param {string} mode - Travel mode (driving, walking, bicycling, transit)
 * @returns {Promise<object>} Distance matrix result
 */
const getDistance = async (origin, destination, mode = 'driving') => {
  try {
    const result = await mapsClient
      .distance({
        origins: [origin],
        destinations: [destination],
        mode
      })
      .asPromise();
    return result.json;
  } catch (error) {
    throw new Error(`Distance calculation error: ${error.message}`);
  }
};

/**
 * Get directions
 * @param {string} origin - Origin address or coordinates
 * @param {string} destination - Destination address or coordinates
 * @param {string} mode - Travel mode
 * @returns {Promise<object>} Directions result
 */
const getDirections = async (origin, destination, mode = 'driving') => {
  try {
    const result = await mapsClient
      .directions({
        origin,
        destination,
        mode
      })
      .asPromise();
    return result.json;
  } catch (error) {
    throw new Error(`Directions error: ${error.message}`);
  }
};

/**
 * Get autocomplete predictions
 * @param {string} input - User input
 * @param {object} options - Additional options
 * @returns {Promise<object>} Autocomplete predictions
 */
const getAutocompletePredictions = async (input, options = {}) => {
  try {
    const result = await mapsClient
      .places({
        input,
        ...options
      })
      .asPromise();
    return result.json;
  } catch (error) {
    throw new Error(`Autocomplete error: ${error.message}`);
  }
};

/**
 * Get place details
 * @param {string} placeId - Google Place ID
 * @returns {Promise<object>} Place details
 */
const getPlaceDetails = async (placeId) => {
  try {
    const result = await mapsClient.place({ place_id: placeId }).asPromise();
    return result.json;
  } catch (error) {
    throw new Error(`Place details error: ${error.message}`);
  }
};

// Initialize and validate on startup
initializeMapsClient();

async function initializeMapsClient() {
  if (process.env.NODE_ENV !== 'test') {
    const isValid = await validateMapsKey();
    if (!isValid) {
      console.warn('Warning: Google Maps API key validation failed. Some features may not work.');
    }
  }
}

module.exports = {
  mapsClient,
  validateMapsKey,
  geocode,
  reverseGeocode,
  getDistance,
  getDirections,
  getAutocompletePredictions,
  getPlaceDetails
};
