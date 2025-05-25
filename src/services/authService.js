// src/services/authService.js
import api from "../utils/axiosConfig";

// Register new user
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  // No need to handle tokens since they're in HTTP-only cookies
  return response.data;
};

// Login user
export const login = async (email, password) => {
  const response = await api.post(
    "/auth/login",
    { email, password },
    { withCredentials: true }
  );
  // No need to handle tokens since they're in HTTP-only cookies
  return response.data;
};

// Logout user
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout API error", error);
  }
  // Cookies are cleared by the server
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.user;
};

// Refresh token (now handled automatically by axios interceptor)
export const refreshToken = async () => {
  const response = await api.post("/auth/refresh-token");
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    password,
  });
  // No need to handle tokens since they're in HTTP-only cookies
  return response.data;
};

// Check reset token validity
export const checkResetToken = async (token) => {
  const response = await api.get(`/auth/check-reset-token/${token}`);
  return response.data.success;
};

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await api.patch("/auth/update-profile", profileData);
  return response.data;
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
  const response = await api.patch("/auth/update-password", {
    currentPassword,
    newPassword,
  });
  // No need to handle tokens since they're in HTTP-only cookies
  return response.data;
};
