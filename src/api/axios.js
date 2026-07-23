import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://moneymate-backend-oclv.onrender.com",
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Add request interceptor to include Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration and retry logic
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't retry if it's already a retry or auth error
    if (originalRequest._retry || error.response?.status === 401) {
      return Promise.reject(error);
    }
    
    // Retry on network errors or 5xx server errors
    if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      
      if (originalRequest._retry <= MAX_RETRIES) {
        console.log(`Retrying request (${originalRequest._retry}/${MAX_RETRIES})...`);
        await sleep(RETRY_DELAY * originalRequest._retry);
        return API(originalRequest);
      }
    }
    
    // Handle 401 errors - clear auth data and redirect
    if (error.response?.status === 401) {
      // Token expired or invalid - clear all auth data
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;