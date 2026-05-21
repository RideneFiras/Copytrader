import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('ct_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const persist = useCallback((token, u) => {
    if (token) localStorage.setItem('ct_token', token);
    if (u) {
      localStorage.setItem('ct_user', JSON.stringify(u));
      setUser(u);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ct_token');
    localStorage.removeItem('ct_user');
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const adminAuth = useCallback(async (password) => {
    const { data } = await api.post('/admin/auth', { password });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  // Hydrate from /me if we have a token but want fresh data
  useEffect(() => {
    const token = localStorage.getItem('ct_token');
    if (!token || !user) return;
    setLoading(true);
    api
      .get('/auth/me')
      .then(({ data }) => persist(null, data.user))
      .catch(() => logout())
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, adminAuth, logout, setUser }),
    [user, loading, login, register, adminAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
