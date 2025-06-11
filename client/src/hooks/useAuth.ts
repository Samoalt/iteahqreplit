import { useState, useEffect } from 'react';
import { User } from '@/types';
import { apiRequest } from '@/lib/queryClient';

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
      const response = await apiRequest('GET', '/api/auth/me');
      const data = await response.json();
      globalUser = data.user;
      notifyListeners();
    } catch (error) {
      initializeUser();
      notifyListeners();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest('POST', '/auth/login', { email, password });
      if (response.token && response.user) {
        localStorage.setItem('auth_token', response.token);
        globalUser = response.user;
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