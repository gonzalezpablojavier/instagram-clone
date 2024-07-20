import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient'; // Importa el cliente Axios configurado
interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  setUser: (user: { username: string } | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth ? JSON.parse(savedAuth) : false;
  });

  const [user, setUser] = useState<{ username: string } | null>(() => {
    const savedUser = localStorage.getItem('nombreUsuario');
    return savedUser ? { username: savedUser } : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nombreUsuario', user.username);
    } else {
      localStorage.removeItem('nombreUsuario');
    }
  }, [user]);
//elated-kowalevski.51-222-158-198.plesk.page
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/login', { username, password }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (response.status === 201) {
        const { colaboradorID, nombreUsuario } = response.data;
        setUser({ username: nombreUsuario });
        localStorage.setItem('colaboradorID', colaboradorID);
        localStorage.setItem('nombreUsuario', nombreUsuario);
        setIsAuthenticated(true);
        navigate('/');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('colaboradorID');
    localStorage.removeItem('nombreUsuario');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
