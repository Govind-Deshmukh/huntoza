// src/utils/toastUtils.js
import { toast } from "react-toastify";

// Show a success toast notification
export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Show an error toast notification
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

// Handle API errors and show appropriate toast
export const handleApiError = (error) => {
  const errorMessage =
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred";

  showErrorToast(errorMessage);

  // Log the error for debugging
  console.error("API Error:", error);

  return errorMessage;
};

export default {
  showSuccessToast,
  showErrorToast,
  handleApiError,
};
