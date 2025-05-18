import { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { getAuthState, login as authLogin, logout as authLogout, register as authRegister } from '../auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const state = getAuthState();
    setUser(state.user);
    setIsAuthenticated(state.isAuthenticated);
    setRole(state.role);
    setIsLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const user = await authLogin(email, password);
      setUser(user);
      setIsAuthenticated(true);
      setRole(user.role);
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authLogout();
      setUser(null);
      setIsAuthenticated(false);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (username: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      const user = await authRegister(username, email, password, role);
      setUser(user);
      setIsAuthenticated(true);
      setRole(user.role);
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user has required role(s)
  const hasRole = useCallback((requiredRole: UserRole | UserRole[]) => {
    if (!role) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    return role === requiredRole;
  }, [role]);

  return {
    user,
    isAuthenticated,
    role,
    isLoading,
    login,
    logout,
    register,
    hasRole,
  };
}
