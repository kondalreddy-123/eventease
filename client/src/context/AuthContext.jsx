import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('eventease_token'));
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        setUser(res.user);
        setIsDemo(res.user.email === 'demo@eventease.ai');
      } catch (err) {
        console.warn('Session expired or invalid:', err.message);
        localStorage.removeItem('eventease_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem('eventease_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsDemo(false);
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('eventease_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsDemo(false);
    return res;
  };

  const demoLogin = async () => {
    const res = await api.demoLogin();
    localStorage.setItem('eventease_token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsDemo(true);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('eventease_token');
    localStorage.removeItem('eventease_active_event_id');
    setToken(null);
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isDemo,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      demoLogin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
