import axiosInstance from '../config/axios.config';

const API_BASE = '/payments';

export const paymentService = {
  createOrder: async (rideId, amount) => {
    const response = await axiosInstance.post(`${API_BASE}/create-order`, {
      rideId,
      amount,
    });
    return response.data;
  },

  verifyPayment: async (rideId, razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const response = await axiosInstance.post(`${API_BASE}/verify-payment`, {
      rideId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    return response.data;
  },

  getPaymentHistory: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`${API_BASE}/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  requestRefund: async (paymentId, reason) => {
    const response = await axiosInstance.post(`${API_BASE}/refund`, {
      paymentId,
      reason,
    });
    return response.data;
  },

  getRefundStatus: async (refundId) => {
    const response = await axiosInstance.get(`${API_BASE}/refund/${refundId}`);
    return response.data;
  },

  getSavedPaymentMethods: async () => {
    const response = await axiosInstance.get(`${API_BASE}/saved-methods`);
    return response.data;
  },

  addPaymentMethod: async (methodData) => {
    const response = await axiosInstance.post(`${API_BASE}/payment-method`, methodData);
    return response.data;
  },

  deletePaymentMethod: async (methodId) => {
    const response = await axiosInstance.delete(`${API_BASE}/payment-method/${methodId}`);
    return response.data;
  },

  setDefaultPaymentMethod: async (methodId) => {
    const response = await axiosInstance.post(`${API_BASE}/set-default-method`, { methodId });
    return response.data;
  },
};
