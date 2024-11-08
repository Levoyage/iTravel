import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Provide the context to children components
export const AuthProvider = ({ children }) => {
  // Persisted user and token states
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated (based on token and isAuthenticated flag)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    console.log("Token on refresh:", token);
    console.log("isAuthenticated on refresh:", isAuthenticated);

    // If both the token and isAuthenticated flag are valid
    if (token && isAuthenticated) {
      checkAuth(token);
    } else {
      setLoading(false);  // Stop loading if no valid token or flag
    }
  }, []);

  // Check authentication by sending the token to the backend
  const checkAuth = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);  // Reset user if the auth check fails
    } finally {
      setLoading(false);
    }
  };

  // Handle registration logic
  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });
      return response.data;  // 返回注册数据，或者根据需要返回其他内容
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Handle login logic
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password });
      const { token, ...userData } = response.data;

      // Store token and authenticated status
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');
      setUser(userData);  // Update the user state
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Handle logout logic
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated'); // Clear authenticated flag
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {!loading ? children : <div>Loading...</div>}  {/* Show loading spinner */}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext in other components
export const useAuth = () => {
  return useContext(AuthContext);
};
