// src/utils/toastUtils.js
import { toast } from "react-toastify";

// Show success toast
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

// Show error toast
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

// Handle API error and display appropriate toast
export const handleApiError = (error) => {
  let errorMessage = "An unexpected error occurred";

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    errorMessage =
      error.response.data?.message || `Error: ${error.response.status}`;

    // Handle specific status codes
    if (error.response.status === 401) {
      errorMessage = "Session expired. Please log in again.";
    } else if (error.response.status === 403) {
      errorMessage = "You don't have permission to perform this action.";
    } else if (error.response.status === 429) {
      errorMessage = "Too many requests. Please try again later.";
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage =
      "No response from server. Please check your internet connection.";
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMessage = error.message || errorMessage;
  }

  showErrorToast(errorMessage);
  return errorMessage;
};
