// src/utils/axiosConfig.js
import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for HTTP-only cookies
});

// Remove the old token management functions since we're using HTTP-only cookies
// No need for setAuthToken function anymore

// Setup interceptor for handling token expiration
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response?.data?.code === "TOKEN_EXPIRED"
    ) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token using HTTP-only cookies
        await axiosInstance.post("/auth/refresh-token");

        // Process all queued requests
        processQueue(null);

        // Return the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Process the queue with an error
        processQueue(refreshError, null);

        // If refresh token fails, redirect to login
        // This will be handled by the auth context
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
