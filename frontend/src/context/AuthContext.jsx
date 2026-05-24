import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginAdmin as apiLogin, logoutAdmin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      const stored = localStorage.getItem('user');
      if (token && stored) {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(JSON.parse(stored));
        } else {
          // Token expired — try refreshing via interceptor later
          logoutAdmin();
        }
      }
    } catch {
      logoutAdmin();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await apiLogin(username, password);
    const decoded = jwtDecode(data.access);
    const userData = {
      id: decoded.user_id,
      username: decoded.username || username,
      email: decoded.email || '',
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    logoutAdmin();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;