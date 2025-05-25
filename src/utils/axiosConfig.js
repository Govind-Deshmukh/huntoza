// src/utils/axiosConfig.js
import axios from "axios";
import { refreshToken } from "../services/authService";

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Variable to track if refresh token request is in progress
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Process failed queue (after token refresh)
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

// Request interceptor - not needed for HTTP-only cookies approach
// but can be used for additional headers
api.interceptors.request.use(
  (config) => {
    // You could add additional headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not a retry of a token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If refresh token endpoint returned 401, we can't refresh
      if (originalRequest.url === "/auth/refresh-token") {
        return Promise.reject(error);
      }

      // Mark this request as retried
      originalRequest._retry = true;

      // If not already refreshing, start refresh
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Try to refresh the token
          await refreshToken();

          // If successful, process the queue and retry the original request
          processQueue(null);
          isRefreshing = false;
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, process the queue with error
          processQueue(refreshError);
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      // If already refreshing, add to queue
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default api;
