// src/utils/toastUtils.js
import { toast } from "react-toastify";

/**
 * Show a success toast notification
 * @param {String} message - Message to display
 */
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Show an error toast notification
 * @param {String} message - Message to display
 */
export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Show an info toast notification
 * @param {String} message - Message to display
 */
export const showInfoToast = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

/**
 * Handle API errors and show appropriate toast
 * @param {Error} error - Error object from API call
 */
export const handleApiError = (error) => {
  // Extract message from error response
  const errorMessage =
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred";

  // Check for session expiration
  if (
    error.response?.status === 401 ||
    errorMessage.toLowerCase().includes("session") ||
    errorMessage.toLowerCase().includes("token") ||
    errorMessage.toLowerCase().includes("unauthorized")
  ) {
    showErrorToast("Your session has expired. Please login again.");
    return;
  }

  // Generic error message
  showErrorToast(errorMessage);
};
