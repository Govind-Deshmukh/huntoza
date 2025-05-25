// src/utils/SessionManager.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getCurrentUser, logout } from "../store/slices/authSlice";

/**
 * SessionManager component
 * Manages authentication state and token refreshing
 * Ensures Context API and Redux stay in sync
 */
const SessionManager = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, handleSessionExpiration } = useAuth();

  // Set up axios interceptor for handling token refreshing and auth errors
  useEffect(() => {
    // Response interceptor for handling 401 Unauthorized errors
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle authentication errors (401)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh token
            const refreshResponse = await axios.post("/api/auth/refresh-token");

            // If refresh successful, retry original request
            if (refreshResponse.status === 200) {
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, handle session expiration
            handleSessionExpiration();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptor when component unmounts
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [handleSessionExpiration]);

  // Keep Redux in sync with Context API auth state
  useEffect(() => {
    if (isAuthenticated && user) {
      // Update Redux store with user data from Context
      dispatch(getCurrentUser(user));
    } else if (!isAuthenticated) {
      // Clear auth state in Redux when logged out in Context
      dispatch(logout());
    }
  }, [isAuthenticated, user, dispatch]);

  // This is a utility component that doesn't render anything
  return null;
};

export default SessionManager;
