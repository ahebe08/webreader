import React, { useState, useEffect, createContext, useContext } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.getProfile(storedToken);
        if (response.success) {
          setUser(response.data.utilisateur);
          setToken(storedToken);
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error('Erreur d\'authentification:', error.message);
        // Nettoyer le token invalide
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      if (response.success) {
        const newToken = response.data.token;
        setToken(newToken);
        setUser(response.data.utilisateur);
        localStorage.setItem('token', newToken);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await api.register(email, password);
      if (response.success) {
        const newToken = response.data.token;
        setToken(newToken);
        setUser(response.data.utilisateur);
        localStorage.setItem('token', newToken);
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};