import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set authorization token
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Setup interceptor for handling token expiration
let refreshPromise = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("token") &&
      !originalRequest.url.includes("/auth/refresh-token") // Prevent refresh-token endpoint from triggering another refresh
    ) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await axiosInstance.post("/auth/refresh-token", {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        const newToken = response.data.token;

        if (newToken) {
          // Set the new token
          setAuthToken(newToken);

          // Update authorization header for the original request
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // Process all queued requests with the new token
          processQueue(null, newToken);

          // Return the original request with the new token
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Process the queue with an error
        processQueue(refreshError, null);

        // If refresh token fails, clear tokens and redirect to login
        setAuthToken(null);
        localStorage.removeItem("refreshToken");

        // Throw the refresh error for proper handling
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Initialize token from localStorage on app load
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

export default axiosInstance;
