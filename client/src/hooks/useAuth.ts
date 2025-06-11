import { useState, useEffect } from 'react';
import { User } from '@/types';
import { apiRequest } from '@/lib/queryClient';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiRequest('GET', '/api/auth/me');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password });
      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        role: newRole as "producer" | "buyer" | "ktda_ro" | "ops_admin",
        firstName: newRole === "producer" ? "Michael" : 
                  newRole === "buyer" ? "Sarah" :
                  newRole === "ktda_ro" ? "David" : "Admin",
        lastName: newRole === "producer" ? "Wambugu" : 
                 newRole === "buyer" ? "Chen" :
                 newRole === "ktda_ro" ? "Kimani" : "User",
        username: newRole === "producer" ? "michael.wambugu" : 
                 newRole === "buyer" ? "sarah.chen" :
                 newRole === "ktda_ro" ? "david.kimani" : "admin.user"
      };
      setUser(updatedUser);
      
      // Force page reload to refresh all components with new role
      window.location.href = '/dashboard';
    }
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
