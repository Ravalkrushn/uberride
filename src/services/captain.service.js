import axiosInstance from '../config/axios.config';

const API_BASE = '/captains';

export const captainService = {
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

  uploadDocuments: async (documents) => {
    const formData = new FormData();
    Object.keys(documents).forEach((key) => {
      if (documents[key]) {
        formData.append(key, documents[key]);
      }
    });
    const response = await axiosInstance.post(`${API_BASE}/upload-documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  toggleOnlineStatus: async (isOnline) => {
    const response = await axiosInstance.post(`${API_BASE}/toggle-online`, { isOnline });
    return response.data;
  },

  getEarnings: async (period = 'day') => {
    const response = await axiosInstance.get(`${API_BASE}/earnings?period=${period}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await axiosInstance.get(`${API_BASE}/statistics`);
    return response.data;
  },

  getPerformance: async () => {
    const response = await axiosInstance.get(`${API_BASE}/performance`);
    return response.data;
  },

  getRideHistory: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`${API_BASE}/ride-history?page=${page}&limit=${limit}`);
    return response.data;
  },

  addBankAccount: async (accountData) => {
    const response = await axiosInstance.post(`${API_BASE}/bank-account`, accountData);
    return response.data;
  },

  updateBankAccount: async (accountData) => {
    const response = await axiosInstance.put(`${API_BASE}/bank-account`, accountData);
    return response.data;
  },

  getBankAccount: async () => {
    const response = await axiosInstance.get(`${API_BASE}/bank-account`);
    return response.data;
  },
};
