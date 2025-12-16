import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const login = (username, password) => {
    const result = authService.login(username, password);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const register = (username, email, password) => {
    const result = authService.register(username, email, password);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  };
};
