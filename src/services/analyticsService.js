import api from "../utils/axiosConfig";

/**
 * Load dashboard analytics data
 * @returns {Promise} Promise resolving to dashboard analytics data
 */
export const loadDashboardData = async () => {
  const response = await api.get("/analytics/dashboard");
  return response.data.data;
};

/**
 * Get application analytics
 * @param {String} period - Time period for analytics
 * @returns {Promise} Promise resolving to application analytics
 */
export const getApplicationAnalytics = async (period = "all-time") => {
  const response = await api.get(`/analytics/applications?period=${period}`);
  return response.data.data;
};

/**
 * Get interview analytics
 * @param {String} period - Time period for analytics
 * @returns {Promise} Promise resolving to interview analytics
 */
export const getInterviewAnalytics = async (period = "all-time") => {
  const response = await api.get(`/analytics/interviews?period=${period}`);
  return response.data.data;
};

/**
 * Get task analytics
 * @param {String} period - Time period for analytics
 * @returns {Promise} Promise resolving to task analytics
 */
export const getTaskAnalytics = async (period = "all-time") => {
  const response = await api.get(`/analytics/tasks?period=${period}`);
  return response.data.data;
};

/**
 * Get networking analytics
 * @returns {Promise} Promise resolving to networking analytics
 */
export const getNetworkingAnalytics = async () => {
  const response = await api.get("/analytics/networking");
  return response.data.data;
};

export default {
  loadDashboardData,
  getApplicationAnalytics,
  getInterviewAnalytics,
  getTaskAnalytics,
  getNetworkingAnalytics,
};
