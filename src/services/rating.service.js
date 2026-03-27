import axiosInstance from '../config/axios.config';

const API_BASE = '/ratings';

export const ratingService = {
  rateRide: async (rideId, rating, comment = '', tags = []) => {
    const response = await axiosInstance.post(`${API_BASE}`, {
      rideId,
      rating,
      comment,
      tags,
    });
    return response.data;
  },

  getMyRatings: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`${API_BASE}/my-ratings?page=${page}&limit=${limit}`);
    return response.data;
  },

  getRideRatings: async (rideId) => {
    const response = await axiosInstance.get(`${API_BASE}/ride/${rideId}`);
    return response.data;
  },

  getUserRatings: async (userId) => {
    const response = await axiosInstance.get(`${API_BASE}/user/${userId}`);
    return response.data;
  },

  getCaptainRatings: async (captainId) => {
    const response = await axiosInstance.get(`${API_BASE}/captain/${captainId}`);
    return response.data;
  },

  getAverageRating: async (captainId) => {
    const response = await axiosInstance.get(`${API_BASE}/captain/${captainId}/average`);
    return response.data;
  },

  updateRating: async (ratingId, rating, comment = '', tags = []) => {
    const response = await axiosInstance.put(`${API_BASE}/${ratingId}`, {
      rating,
      comment,
      tags,
    });
    return response.data;
  },

  deleteRating: async (ratingId) => {
    const response = await axiosInstance.delete(`${API_BASE}/${ratingId}`);
    return response.data;
  },
};
