import axiosInstance from '../config/axios.config';

const API_BASE = '/maps';

export const mapsService = {
  autocomplete: async (input, sessionToken = null) => {
    const response = await axiosInstance.get(`${API_BASE}/autocomplete`, {
      params: { input, sessionToken },
    });
    return response.data;
  },

  getPlaceDetails: async (placeId, sessionToken = null) => {
    const response = await axiosInstance.get(`${API_BASE}/place-details`, {
      params: { placeId, sessionToken },
    });
    return response.data;
  },

  geocode: async (address) => {
    const response = await axiosInstance.get(`${API_BASE}/geocode`, {
      params: { address },
    });
    return response.data;
  },

  reverseGeocode: async (latitude, longitude) => {
    const response = await axiosInstance.get(`${API_BASE}/reverse-geocode`, {
      params: { latitude, longitude },
    });
    return response.data;
  },

  getDistance: async (originLat, originLng, destLat, destLng) => {
    const response = await axiosInstance.get(`${API_BASE}/distance`, {
      params: {
        originLat,
        originLng,
        destLat,
        destLng,
      },
    });
    return response.data;
  },

  getRoute: async (originLat, originLng, destLat, destLng) => {
    const response = await axiosInstance.get(`${API_BASE}/route`, {
      params: {
        originLat,
        originLng,
        destLat,
        destLng,
      },
    });
    return response.data;
  },

  getNearbyPlaces: async (latitude, longitude, type = 'hospital', radiusKm = 1) => {
    const response = await axiosInstance.get(`${API_BASE}/nearby-places`, {
      params: { latitude, longitude, type, radiusKm },
    });
    return response.data;
  },
};
