/**
 * Centralized API error handling utility
 * Provides consistent error messages and handling across the application
 */

export const handleApiError = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }

  // Network errors
  if (!error.response) {
    if (error.message === 'Network Error') {
      return 'Network error. Please check your internet connection.';
    }
    return error.message || 'Connection failed. Please try again.';
  }

  // HTTP errors with response
  const status = error.response.status;
  const data = error.response.data;

  switch (status) {
    case 400:
      return data?.detail || data?.error || 'Invalid request. Please check your input.';
    case 401:
      return 'Session expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'Resource not found.';
    case 409:
      return data?.detail || 'Resource already exists.';
    case 422:
      return data?.detail || 'Validation error. Please check your input.';
    case 429:
      return 'Too many requests. Please wait and try again.';
    case 500:
      return 'Server error. Please try again later.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      return data?.detail || data?.error || `Error ${status}: ${error.message}`;
  }
};

export const isAuthError = (error) => {
  return error?.response?.status === 401;
};

export const isNetworkError = (error) => {
  return !error?.response && error?.message === 'Network Error';
};

export const isServerError = (error) => {
  const status = error?.response?.status;
  return status >= 500 && status < 600;
};
