import axiosInstance from '../config/axios.config';

const API_BASE = '/locations';

export const locationService = {
  updateLocation: async (latitude, longitude) => {
    const response = await axiosInstance.post(`${API_BASE}/update`, {
      latitude,
      longitude,
    });
    return response.data;
  },

  getNearbyDrivers: async (latitude, longitude, radiusKm = 5) => {
    const response = await axiosInstance.get(
      `${API_BASE}/nearby-drivers?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
    );
    return response.data;
  },

  checkAvailability: async (latitude, longitude) => {
    const response = await axiosInstance.get(
      `${API_BASE}/availability?latitude=${latitude}&longitude=${longitude}`
    );
    return response.data;
  },

  getDriverLocation: async (driverId) => {
    const response = await axiosInstance.get(`${API_BASE}/driver/${driverId}`);
    return response.data;
  },

  getRiderLocation: async (riderId) => {
    const response = await axiosInstance.get(`${API_BASE}/rider/${riderId}`);
    return response.data;
  },

  getRideRouteLocations: async (rideId) => {
    const response = await axiosInstance.get(`${API_BASE}/ride-route/${rideId}`);
    return response.data;
  },
};
