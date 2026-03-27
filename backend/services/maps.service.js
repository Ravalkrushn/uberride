const GoogleMapsAPI = require('@google/maps');

const mapsClient = GoogleMapsAPI.createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
});

/**
 * Get coordinates from address
 * @param {string} address - Address to geocode
 * @returns {Promise<object>} Coordinates and formatted address
 */
const getCoordinates = async (address) => {
  try {
    if (!address) {
      throw new Error('Address is required');
    }

    const response = await mapsClient.geocode({ address }).asPromise();

    if (response.json.results.length === 0) {
      throw new Error('Address not found');
    }

    const result = response.json.results[0];
    const { lat, lng } = result.geometry.location;

    return {
      coordinates: [lng, lat], // GeoJSON format [longitude, latitude]
      address: result.formatted_address,
      placeId: result.place_id
    };
  } catch (error) {
    console.error('Geocoding Error:', error);
    throw new Error(`Failed to get coordinates: ${error.message}`);
  }
};

/**
 * Get distance and duration between two points
 * @param {object} origin - Origin coordinates {lat, lng}
 * @param {object} destination - Destination coordinates {lat, lng}
 * @param {string} mode - Travel mode (driving, walking, bicycling, transit)
 * @returns {Promise<object>} Distance and duration data
 */
const getDistanceTime = async (origin, destination, mode = 'driving') => {
  try {
    if (!origin || !destination) {
      throw new Error('Origin and destination are required');
    }

    const originString = `${origin.lat},${origin.lng}`;
    const destinationString = `${destination.lat},${destination.lng}`;

    const response = await mapsClient
      .distance({
        origins: [originString],
        destinations: [destinationString],
        mode: mode
      })
      .asPromise();

    if (response.json.rows.length === 0 || response.json.rows[0].elements.length === 0) {
      throw new Error('Route not found');
    }

    const element = response.json.rows[0].elements[0];

    if (element.status !== 'OK') {
      throw new Error(element.status);
    }

    return {
      distance: {
        value: element.distance.value, // meters
        text: element.distance.text
      },
      duration: {
        value: element.duration.value, // seconds
        text: element.duration.text
      },
      status: element.status
    };
  } catch (error) {
    console.error('Distance Matrix Error:', error);
    throw new Error(`Failed to get distance: ${error.message}`);
  }
};

/**
 * Get autocomplete suggestions for address
 * @param {string} input - Partial address input
 * @param {object} options - Additional options (componentRestrictions, etc.)
 * @returns {Promise<array>} Array of place predictions
 */
const getAutocompleteSuggestions = async (input, options = {}) => {
  try {
    if (!input) {
      throw new Error('Input is required');
    }

    const response = await mapsClient
      .places({
        input: input,
        ...options
      })
      .asPromise();

    if (response.json.predictions.length === 0) {
      return [];
    }

    return response.json.predictions.map((prediction) => ({
      placeId: prediction.place_id,
      mainText: prediction.main_text,
      secondaryText: prediction.secondary_text,
      description: prediction.description,
      types: prediction.types
    }));
  } catch (error) {
    console.error('Autocomplete Error:', error);
    throw new Error(`Failed to get suggestions: ${error.message}`);
  }
};

/**
 * Get place details from place ID
 * @param {string} placeId - Google Maps place ID
 * @returns {Promise<object>} Detailed place information
 */
const getPlaceDetails = async (placeId) => {
  try {
    if (!placeId) {
      throw new Error('Place ID is required');
    }

    const response = await mapsClient.place({ place_id: placeId }).asPromise();

    const result = response.json.result;

    return {
      address: result.formatted_address,
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng
      },
      phoneNumber: result.formatted_phone_number,
      website: result.website,
      photos: result.photos ? result.photos.map((photo) => photo.photo_reference) : [],
      rating: result.rating,
      reviews: result.reviews
    };
  } catch (error) {
    console.error('Place Details Error:', error);
    throw new Error(`Failed to get place details: ${error.message}`);
  }
};

module.exports = {
  getCoordinates,
  getDistanceTime,
  getAutocompleteSuggestions,
  getPlaceDetails
};
