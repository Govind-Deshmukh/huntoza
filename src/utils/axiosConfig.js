// src/utils/axiosConfig.js
import axios from "axios";
import { store } from "../store";
import { handleSessionExpiration } from "../store/slices/authSlice";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Enable cookies for auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (if using JWT in header)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshResponse = await axios.post(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:5000/api"
          }/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // If token refresh was successful
        if (refreshResponse.status === 200) {
          // If using JWT in header, update it
          if (refreshResponse.data.token) {
            localStorage.setItem("token", refreshResponse.data.token);
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${refreshResponse.data.token}`;
          }

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, dispatch logout action
        store.dispatch(handleSessionExpiration());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
