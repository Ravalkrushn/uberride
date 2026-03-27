import axiosInstance from '../config/axios.config';

const API_BASE = '/auth';

export const authService = {
  registerRider: async (data) => {
    const response = await axiosInstance.post(`${API_BASE}/register-rider`, data);
    return response.data;
  },

  registerCaptain: async (data) => {
    const response = await axiosInstance.post(`${API_BASE}/register-captain`, data);
    return response.data;
  },

  sendOtp: async (phone) => {
    const response = await axiosInstance.post(`${API_BASE}/send-otp`, { phone });
    return response.data;
  },

  verifyOtp: async (phone, otp) => {
    const response = await axiosInstance.post(`${API_BASE}/verify-otp`, { phone, otp });
    return response.data;
  },

  riderLogin: async (phone, password) => {
    const response = await axiosInstance.post(`${API_BASE}/rider-login`, { phone, password });
    return response.data;
  },

  captainLogin: async (phone, password) => {
    const response = await axiosInstance.post(`${API_BASE}/captain-login`, { phone, password });
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(`${API_BASE}/logout`);
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post(`${API_BASE}/refresh-token`, { refreshToken });
    return response.data;
  },

  profile: async () => {
    const response = await axiosInstance.get(`${API_BASE}/profile`);
    return response.data;
  },
};
