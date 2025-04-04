import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    username: 'demo_user',
    email: 'demo@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Completely remove any authentication checks
  const login = async () => {
    setIsAuthenticated(true);
    return { success: true };
  };

  const register = async () => {
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    // Optional: Keep this empty or reset to demo user
    setUser({
      id: 1,
      username: 'demo_user',
      email: 'demo@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3'
    });
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};