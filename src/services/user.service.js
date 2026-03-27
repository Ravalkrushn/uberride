import axiosInstance from '../config/axios.config';

const API_BASE = '/users';

export const userService = {
  getProfile: async () => {
    const response = await axiosInstance.get(`${API_BASE}/profile`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.put(`${API_BASE}/profile`, data);
    return response.data;
  },

  uploadProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    const response = await axiosInstance.post(`${API_BASE}/upload-photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  addAddress: async (label, address, coordinates) => {
    const response = await axiosInstance.post(`${API_BASE}/addresses`, {
      label,
      address,
      coordinates,
    });
    return response.data;
  },

  getAddresses: async () => {
    const response = await axiosInstance.get(`${API_BASE}/addresses`);
    return response.data;
  },

  updateAddress: async (addressId, data) => {
    const response = await axiosInstance.put(`${API_BASE}/addresses/${addressId}`, data);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await axiosInstance.delete(`${API_BASE}/addresses/${addressId}`);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await axiosInstance.post(`${API_BASE}/change-password`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  deleteAccount: async (password) => {
    const response = await axiosInstance.delete(`${API_BASE}/account`, {
      data: { password },
    });
    return response.data;
  },

  getWallet: async () => {
    const response = await axiosInstance.get(`${API_BASE}/wallet`);
    return response.data;
  },

  addMoneyToWallet: async (amount) => {
    const response = await axiosInstance.post(`${API_BASE}/wallet/add-money`, { amount });
    return response.data;
  },
};
