import React, { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@/types';
import { apiRequest } from '@/lib/queryClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  switchRole: (newRole: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const data = await apiRequest('GET', '/auth/me');
        if (data && data.id) {
          setUser(data);
        } else {
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiRequest('POST', '/auth/login', { email, password });
      if (data.token && data.user) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const switchRole = (newRole: string) => {
    if (user) {
      setUser({
        ...user,
        role: newRole as "producer" | "buyer" | "ktda_ro" | "ops_admin"
      });
    }
  };

  const checkAuth = async () => {
    await checkAuthStatus();
  };

  const value = { user, isLoading, login, logout, checkAuth, switchRole };
  
  return React.createElement(AuthContext.Provider, { value }, children);
}