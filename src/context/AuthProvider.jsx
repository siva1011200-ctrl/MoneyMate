import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { userAPI } from "../services/api-service";
import { handleApiError, isAuthError } from "../utils/apiErrorHandler";

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("access_token") || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", accessToken);
    setError(null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setError(null);
  };

  const loginWithCredentials = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userAPI.login({ email, password });
      const { user, access_token } = response.data;
      await login(user, access_token);
      return { success: true };
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const registerWithCredentials = async (name, email, password, type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userAPI.register({ name, email, password, type });
      const { user, access_token } = response.data;
      await login(user, access_token);
      return { success: true };
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Validate token on mount
  useEffect(() => {
    if (token && !user) {
      // Token exists but no user data - clear invalid state
      logout();
    }
  }, [token, user]);

  // Refresh user data periodically
  useEffect(() => {
    const refreshUserData = async () => {
      if (token && user) {
        try {
          const response = await userAPI.getProfile();
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (err) {
          if (isAuthError(err)) {
            logout();
          }
        }
      }
    };

    // Refresh every 5 minutes
    const interval = setInterval(refreshUserData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        logout,
        loginWithCredentials,
        registerWithCredentials,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;