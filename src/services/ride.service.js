import axiosInstance from '../config/axios.config';

const API_BASE = '/rides';

export const rideService = {
  estimateFare: async (pickupLat, pickupLng, dropLat, dropLng, vehicleType) => {
    const response = await axiosInstance.post(`${API_BASE}/estimate-fare`, {
      pickupLocation: { latitude: pickupLat, longitude: pickupLng },
      dropoffLocation: { latitude: dropLat, longitude: dropLng },
      vehicleType,
    });
    return response.data;
  },

  requestRide: async (pickupLat, pickupLng, dropLat, dropLng, pickupAddress, dropoffAddress, vehicleType) => {
    const response = await axiosInstance.post(`${API_BASE}/request`, {
      pickupLocation: { latitude: pickupLat, longitude: pickupLng },
      dropoffLocation: { latitude: dropLat, longitude: dropLng },
      pickupAddress,
      dropoffAddress,
      vehicleType,
    });
    return response.data;
  },

  cancelRide: async (rideId) => {
    const response = await axiosInstance.post(`${API_BASE}/${rideId}/cancel`);
    return response.data;
  },

  acceptRide: async (rideId) => {
    const response = await axiosInstance.post(`${API_BASE}/${rideId}/accept`);
    return response.data;
  },

  rejectRide: async (rideId) => {
    const response = await axiosInstance.post(`${API_BASE}/${rideId}/reject`);
    return response.data;
  },

  startRide: async (rideId, otp) => {
    const response = await axiosInstance.post(`${API_BASE}/${rideId}/start`, { otp });
    return response.data;
  },

  endRide: async (rideId) => {
    const response = await axiosInstance.post(`${API_BASE}/${rideId}/end`);
    return response.data;
  },

  getRideDetails: async (rideId) => {
    const response = await axiosInstance.get(`${API_BASE}/${rideId}`);
    return response.data;
  },

  getRideHistory: async (page = 1, limit = 10, status = '') => {
    let url = `${API_BASE}/history?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getActiveRide: async () => {
    const response = await axiosInstance.get(`${API_BASE}/active`);
    return response.data;
  },

  getNearbyRides: async (latitude, longitude, radiusKm = 5) => {
    const response = await axiosInstance.get(
      `${API_BASE}/nearby?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
    );
    return response.data;
  },
};
