import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.API_base;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'normal' or 'nominee'
  const [biometricEnrolled, setBiometricEnrolled] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);

  // Set up axios defaults
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('token');
      const storedUserType = sessionStorage.getItem('userType');
      const storedBiometricEnrolled = sessionStorage.getItem('biometricEnrolled');
      const storedFaceVerified = sessionStorage.getItem('faceVerified');

      if (token) {
        try {
          // Load user data from sessionStorage
          const storedUser = sessionStorage.getItem('user');
          const userData = storedUser ? JSON.parse(storedUser) : { token };
          setUser(userData);
          setUserType(storedUserType || 'normal');
          setBiometricEnrolled(storedBiometricEnrolled === 'true');
          setFaceVerified(storedFaceVerified === 'true');
        } catch (error) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('userType');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('biometricEnrolled');
          sessionStorage.removeItem('faceVerified');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Periodically check if the token is deleted from sessionStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const token = sessionStorage.getItem('token');
      if (!token && user) {
        logout();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Inactivity timeout of 10 minutes
  useEffect(() => {
    if (!user) return;

    let timeoutId;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 10 * 60 * 1000); // 10 minutes
    };

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  const login = async (email, password, type = 'normal') => {
    try {
      const apiEndpoint = type === 'nominee'
        ? `${API_BASE}/api/nominees/login`
        : `${API_BASE}/api/users/login`;

      const response = await axios.post(apiEndpoint, {
        email,
        password
      });

      const { token, userType: responseUserType, user: userData } = response.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userType', responseUserType || type);
      sessionStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData || { token });
      setUserType(responseUserType || type);
      return { success: true, userType: responseUserType || type, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const signup = async (formData, type = 'normal') => {
    try {
      const apiEndpoint = type === 'nominee'
        ? `${API_BASE}/api/nominees/register`
        : `${API_BASE}/api/users/register`;

      const response = await axios.post(apiEndpoint, formData);

      const { token, userType: responseUserType, user: userData } = response.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userType', responseUserType || type);
      sessionStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData || { token });
      setUserType(responseUserType || type);
      return { success: true, userType: responseUserType || type, user: userData };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed'
      };
    }
  };

  const getUserProfile = async () => {
    try {
      const apiEndpoint = userType === 'nominee'
        ? `${API_BASE}/api/nominees/profile`
        : `${API_BASE}/api/users/profile`;

      const response = await axios.get(apiEndpoint);
      return { success: true, user: response.data.user || response.data.nominee };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user profile'
      };
    }
  };

  const checkBiometricEnrollment = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE}/api/faces/enrollment-status/${userId}`);
      const isEnrolled = response.data.isEnrolled;
      setBiometricEnrolled(isEnrolled);
      sessionStorage.setItem('biometricEnrolled', isEnrolled.toString());
      return isEnrolled;
    } catch (error) {
      console.error('Error checking biometric enrollment:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const apiEndpoint = userType === 'nominee'
        ? `${API_BASE}/api/nominees/logout`
        : `${API_BASE}/api/users/logout`;

      await axios.post(apiEndpoint);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userType');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('biometricEnrolled');
      sessionStorage.removeItem('faceVerified');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setUserType(null);
      setBiometricEnrolled(false);
      setFaceVerified(false);
    }
  };

  const setFaceVerificationStatus = (verified) => {
    setFaceVerified(verified);
    sessionStorage.setItem('faceVerified', verified.toString());
  };

  const value = {
    user,
    userType,
    biometricEnrolled,
    faceVerified,
    login,
    signup,
    logout,
    getUserProfile,
    checkBiometricEnrollment,
    setFaceVerificationStatus,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
