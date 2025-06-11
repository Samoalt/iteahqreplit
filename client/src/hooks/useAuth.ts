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

// Global state for role switching
let globalUser: User | null = null;
let globalListeners: Set<(user: User | null) => void> = new Set();

const notifyListeners = () => {
  globalListeners.forEach(listener => listener(globalUser));
};

const initializeUser = () => {
  if (!globalUser) {
    globalUser = {
      id: 1,
      username: "sarah.chen",
      firstName: "Sarah",
      lastName: "Chen",
      role: "buyer",
      email: "sarah.chen@example.com",
      isActive: true,
      workspace: "Buyer"
    };
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUser();
    setUser(globalUser);
    setIsLoading(false);
    
    // Add this component to listeners
    globalListeners.add(setUser);
    
    return () => {
      globalListeners.delete(setUser);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const data = await apiRequest('GET', '/auth/me');
        globalUser = data;
        notifyListeners();
      } else {
        initializeUser();
        notifyListeners();
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      initializeUser();
      notifyListeners();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await apiRequest('POST', '/auth/login', { email, password });
      if (data.token && data.user) {
        localStorage.setItem('auth_token', data.token);
        globalUser = data.user;
        notifyListeners();
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
    globalUser = null;
    notifyListeners();
  };

  const switchRole = (newRole: string) => {
    const updatedUser: User = {
      id: 1,
      email: "test@example.com",
      isActive: true,
      role: newRole as "producer" | "buyer" | "ktda_ro" | "ops_admin",
      firstName: newRole === "producer" ? "Michael" : 
                newRole === "buyer" ? "Sarah" :
                newRole === "ktda_ro" ? "David" : "Admin",
      lastName: newRole === "producer" ? "Wambugu" : 
               newRole === "buyer" ? "Chen" :
               newRole === "ktda_ro" ? "Kimani" : "User",
      username: newRole === "producer" ? "michael.wambugu" : 
               newRole === "buyer" ? "sarah.chen" :
               newRole === "ktda_ro" ? "david.kimani" : "admin.user",
      workspace: (newRole === "producer" ? "Producer" :
                 newRole === "buyer" ? "Buyer" :
                 newRole === "ktda_ro" ? "KTDA Board" : "Operations") as "Producer" | "Buyer" | "KTDA Board" | "Operations"
    };
    globalUser = updatedUser;
    notifyListeners();
  };

  return {
    user,
    isLoading,
    login,
    logout,
    checkAuth,
    switchRole
  };
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
        setUser(data);
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