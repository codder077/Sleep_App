import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (apiService.isAuthenticated()) {
          const response = await apiService.getCurrentUser();
          if (response.success) {
            setCurrentUser(response.data.user);
          } else {
            // Token is invalid, clear it
            apiService.setToken(null);
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        apiService.setToken(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await apiService.login({ email, password });
      if (response.success) {
        setCurrentUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const register = async (displayName, email, password) => {
    try {
      setError(null);
      const response = await apiService.register({ displayName, email, password });
      if (response.success) {
        setCurrentUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        setError(response.message || 'Registration failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      setError(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      setError(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await apiService.updateProfile(profileData);
      if (response.success) {
        setCurrentUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        setError(response.message || 'Profile update failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      setError(error.message || 'Profile update failed');
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 