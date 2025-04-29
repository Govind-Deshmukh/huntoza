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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("token")
    ) {
      originalRequest._retry = true;

      try {
        // Avoid multiple refresh requests
        if (!refreshPromise) {
          refreshPromise = axiosInstance
            .post("/auth/refresh-token")
            .then((res) => res.data.token)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        if (newToken) {
          // Set the new token
          setAuthToken(newToken);

          // Retry the original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token fails, clear tokens and redirect to login
        setAuthToken(null);
        return Promise.reject(refreshError);
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
