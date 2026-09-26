import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  username: string;
  role: 'super_admin' | 'admin' | 'technician';
}

interface AuthContextType {
  token: string | null;
  user: AdminUser | null;
  isLoading: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('al_arriqi_admin_token'));
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('al_arriqi_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If we have a local session or backend is offline, preserve the user without logging them out
    if (token) {
      if (token.startsWith('local_session_') || token.startsWith('client_')) {
        // Client-side validated session, keep active
        setIsLoading(false);
        return;
      }

      // Try verifying session with backend if available
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(async (res) => {
          if (!res.ok) {
            // If response is 401 explicitly, clear session. If 404 (e.g. Vercel static), do not destroy session!
            if (res.status === 401) {
              throw new Error('Unauthorized');
            }
            return null;
          }
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            return res.json();
          }
          return null;
        })
        .then((userData) => {
          if (userData && userData.id) {
            setUser(userData);
            localStorage.setItem('al_arriqi_admin_user', JSON.stringify(userData));
          }
        })
        .catch((err) => {
          if (err.message === 'Unauthorized') {
            setToken(null);
            setUser(null);
            localStorage.removeItem('al_arriqi_admin_token');
            localStorage.removeItem('al_arriqi_admin_user');
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = (newToken: string, newUser: AdminUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('al_arriqi_admin_token', newToken);
    localStorage.setItem('al_arriqi_admin_user', JSON.stringify(newUser));
  };

  const logout = () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('al_arriqi_admin_token');
    localStorage.removeItem('al_arriqi_admin_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
