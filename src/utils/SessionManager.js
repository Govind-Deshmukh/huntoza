// src/utils/SessionManager.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

/**
 * Session manager component to handle global auth events
 * This is a non-rendering component that sets up listeners for auth events
 */
const SessionManager = () => {
  const { handleSessionExpiration } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up axios interceptor for handling 401 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Check if error is 401 Unauthorized
        if (error.response && error.response.status === 401) {
          // Call session expiration handler
          handleSessionExpiration();
          // Redirect to login
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [handleSessionExpiration, navigate]);

  // This component doesn't render anything
  return null;
};

export default SessionManager;
