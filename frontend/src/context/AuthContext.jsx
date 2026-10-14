import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('neu_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('neu_token') || '');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('neu_token', token);
    } else {
      localStorage.removeItem('neu_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('neu_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('neu_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      // Local fallback for offline / standalone mode
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const fallbackUser = {
          id: 'user_local_1',
          name: email.split('@')[0] || 'Explorer',
          email,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
        };
        setUser(fallbackUser);
        setToken('token_offline_fallback');
        setIsAuthModalOpen(false);
        return { user: fallbackUser };
      }
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Registration failed');
      }

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const fallbackUser = {
          id: `user_${Date.now()}`,
          name: name || email.split('@')[0],
          email,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
        };
        setUser(fallbackUser);
        setToken('token_offline_fallback');
        setIsAuthModalOpen(false);
        return { user: fallbackUser };
      }
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googlePayload) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googlePayload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Google Sign-In failed');
      }

      const data = await res.json();
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const email = googlePayload.email || 'google.user@example.com';
        const fallbackUser = {
          id: `user_google_${Date.now()}`,
          name: googlePayload.name || 'Google Explorer',
          email,
          avatar: googlePayload.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
        };
        setUser(fallbackUser);
        setToken('token_offline_fallback');
        setIsAuthModalOpen(false);
        return { user: fallbackUser };
      }
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('neu_user');
    localStorage.removeItem('neu_token');
  };

  const openLogin = () => {
    setAuthMode('login');
    setError('');
    setIsAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setError('');
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        setError,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        register,
        loginWithGoogle,
        logout,
        openLogin,
        openRegister
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
