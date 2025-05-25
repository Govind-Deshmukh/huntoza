import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import * as authService from "../services/authService";
import {
  showSuccessToast,
  showErrorToast,
  handleApiError,
} from "../utils/toastUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading to check for existing session
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Load user from server (check if session exists)
  const loadUserFromServer = useCallback(async () => {
    try {
      setIsLoading(true);
      // Try to get current user using HTTP-only cookies
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      // No valid session found, user needs to login
      setUser(null);
      setIsAuthenticated(false);
      console.log("No valid session found");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    loadUserFromServer();
  }, [loadUserFromServer]);

  // Register user
  const register = useCallback(
    async (userData) => {
      try {
        setIsLoading(true);
        clearError();

        const data = await authService.register(userData);
        setUser(data.user);
        setIsAuthenticated(true);

        showSuccessToast("Account created successfully!");
        return data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Registration failed";
        setError(errorMessage);
        handleApiError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError]
  );

  // Login user
  const login = useCallback(
    async (email, password) => {
      try {
        setIsLoading(true);
        clearError();

        const data = await authService.login(email, password);
        setUser(data.user);
        setIsAuthenticated(true);

        showSuccessToast(`Welcome back, ${data.user.name || "User"}!`);
        return data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Invalid credentials";
        setError(errorMessage);
        handleApiError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError]
  );

  // Logout user
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      showSuccessToast("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      // Still proceed with local logout even if API call fails
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(
    async (email) => {
      try {
        setIsLoading(true);
        clearError();
        const result = await authService.forgotPassword(email);
        showSuccessToast("Password reset instructions sent to your email");
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to process request";
        setError(errorMessage);
        handleApiError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError]
  );

  // Reset password
  const resetPassword = useCallback(
    async (token, password) => {
      try {
        setIsLoading(true);
        clearError();

        const data = await authService.resetPassword(token, password);

        // After successful password reset, user is automatically logged in
        // Get updated user profile
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        showSuccessToast("Password reset successful!");

        return data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to reset password";
        setError(errorMessage);
        handleApiError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError]
  );

  // Check reset token validity
  const checkResetToken = useCallback(async (token) => {
    try {
      setIsLoading(true);
      return await authService.checkResetToken(token);
    } catch (err) {
      // Don't show toast for this validation check
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(
    async (profileData) => {
      try {
        setIsLoading(true);
        clearError();

        const data = await authService.updateProfile(profileData);
        setUser(data.user);
        showSuccessToast("Profile updated successfully!");

        return data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update profile";
        setError(errorMessage);
        handleApiError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError]
  );

  // Update password
  const updatePassword = useCallback(
    async (currentPassword, newPassword) => {
      try {
        setIsLoading(true);
        clearError();

        const data = await authService.updatePassword(
          currentPassword,
          newPassword
        );

        showSuccessToast("Password updated successfully!");
        return data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update password";
        setError(errorMessage);
        handleApiError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError]
  );

  // Handle session expiration
  const handleSessionExpiration = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    showErrorToast("Your session has expired. Please log in again.");
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
    loadUserFromServer,
    handleSessionExpiration,
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
