import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // BYPASS AUTHENTICATION - Always provide a mock user
  const [user, setUser] = useState({
    id: 1,
    username: 'test_user',
    email: 'test@aovault.net'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip authentication check
    setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('ao-vault-token');
      api.setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { username, password });
      const { user, token } = response.data;

      localStorage.setItem('ao-vault-token', token);
      api.setAuthToken(token);
      setUser(user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;

      localStorage.setItem('ao-vault-token', token);
      api.setAuthToken(token);
      setUser(user);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('ao-vault-token');
    api.setAuthToken(null);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      await api.patch('/auth/me', updates);
      await fetchUser();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Update failed';
      return { success: false, error: message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
