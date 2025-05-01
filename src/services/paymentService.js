import api from "../utils/axiosConfig";

/**
 * Create payment order
 * @param {String} planId - Plan ID
 * @param {String} billingType - Billing type (monthly/yearly)
 * @returns {Promise} Promise resolving to order data
 */
export const createPaymentOrder = async (planId, billingType) => {
  const response = await api.post("/payments/create-order", {
    planId,
    billingType,
  });
  return response.data;
};

/**
 * Verify payment
 * @param {Object} paymentData - Payment verification data
 * @returns {Promise} Promise resolving to verification status
 */
export const verifyPayment = async (paymentData) => {
  const response = await api.post("/payments/verify", paymentData);
  return response.data;
};

/**
 * Get payment history
 * @returns {Promise} Promise resolving to payment history
 */
export const getPaymentHistory = async () => {
  const response = await api.get("/payments/history");
  return response.data.transactions;
};

/**
 * Get payment details by ID
 * @param {String} paymentId - Payment ID
 * @returns {Promise} Promise resolving to payment details
 */
export const getPaymentById = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}`);
  return response.data.transaction;
};

export default {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  getPaymentById,
};
