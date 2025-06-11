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
      setUser({
        ...user,
        role: newRole as "producer" | "buyer" | "ktda_ro" | "ops_admin"
      });
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
