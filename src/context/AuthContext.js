import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import * as authService from "../services/authService";
import { setAuthToken } from "../utils/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading to check token
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Load user from token
  const loadUserFromToken = useCallback(async () => {
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
  }, []);

  // Check for token and load user on mount
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  // Register user
  const register = useCallback(async (userData) => {
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
  }, []);

  // Login user
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.login(email, password);

      // Store refresh token in localStorage if it's returned
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      localStorage.removeItem("refreshToken");
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
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
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.resetPassword(token, password);

      // If token is returned, user is automatically logged in
      if (data.token) {
        // Store refresh token in localStorage if it's returned
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

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
  }, []);

  // Check reset token validity
  const checkResetToken = useCallback(async (token) => {
    try {
      setIsLoading(true);
      return await authService.checkResetToken(token);
    } catch (err) {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
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
  }, []);

  // Update password
  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.updatePassword(
        currentPassword,
        newPassword
      );

      // Store refresh token in localStorage if it's returned
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh user token
  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (!refreshTokenValue) {
        throw new Error("No refresh token found");
      }

      const data = await authService.refreshToken(refreshTokenValue);

      if (data.token) {
        setAuthToken(data.token);
        // If new refreshToken is returned, update it
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        return data.token;
      }

      throw new Error("Failed to refresh token");
    } catch (err) {
      console.error("Token refresh error:", err);
      // Clear auth on refresh failure
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("refreshToken");
      throw err;
    }
  }, []);

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
    refreshToken,
    loadUserFromToken,
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
