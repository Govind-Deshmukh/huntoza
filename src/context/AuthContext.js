import React, { createContext, useState, useEffect, useContext } from "react";
import * as authService from "../services/authService";
import { setAuthToken } from "../utils/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading to check token
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for token and load user on mount
  useEffect(() => {
    const loadUserFromToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Set auth token header
        setAuthToken(token);

        // Load user data
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        // Token might be invalid, clear it
        setAuthToken(null);
        console.error("Error loading user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      return await authService.forgotPassword(email);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.resetPassword(token, password);

      // If token is returned, user is automatically logged in
      if (data.token) {
        // Get updated user profile
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }

      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Check reset token validity
  const checkResetToken = async (token) => {
    try {
      setIsLoading(true);
      return await authService.checkResetToken(token);
    } catch (err) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.updateProfile(profileData);
      setUser(data.user);

      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setIsLoading(true);
      setError(null);

      return await authService.updatePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Context value
  const contextValue = {
    user,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    checkResetToken,
    updateProfile,
    updatePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
