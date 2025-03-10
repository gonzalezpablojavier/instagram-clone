import React, { createContext, useContext, useState, useEffect } from 'react';
import { hasPermission, Route } from '../config/permissions';

interface AuthContextType {
  isAuthenticated: boolean| null;
  colaboradorID: string | null;
  login: (colaboradorID: string) => void;
  logout: () => void;
  hasPermission: (route: Route) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedColaboradorID = localStorage.getItem('colaboradorID');
      const storedToken = localStorage.getItem('access_token');
      if (storedColaboradorID && storedToken) {
        setIsAuthenticated(true);
        setColaboradorID(storedColaboradorID);
      } else {
        setIsAuthenticated(false);
        setColaboradorID(null);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (id: string) => {
    setIsAuthenticated(true);
    setColaboradorID(id);
    localStorage.setItem('colaboradorID', id);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setColaboradorID(null);
    localStorage.removeItem('colaboradorID');
  };

  const checkPermission = (route: Route) => {
    return colaboradorID ? hasPermission(colaboradorID, route) : false;
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      colaboradorID, 
      login, 
      logout, 
      hasPermission: checkPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};