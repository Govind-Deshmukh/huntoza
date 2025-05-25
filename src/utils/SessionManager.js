import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// This component listens for session expiration events and handles them
const SessionManager = () => {
  const { handleSessionExpiration } = useAuth();

  useEffect(() => {
    // Listen for custom session expiration event from axios interceptor
    const handleSessionExpired = () => {
      handleSessionExpiration();
    };

    window.addEventListener("auth:sessionExpired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:sessionExpired", handleSessionExpired);
    };
  }, [handleSessionExpiration]);

  // This component doesn't render anything
  return null;
};

export default SessionManager;
