// src/components/Header.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white p-4 shadow-md flex justify-between items-center fixed top-0 left-0 right-0 z-10 animate__animated animate__fadeInDown">
      <h1 className="text-xl font-bold">Cultura DistriSuper</h1>
      <div className="flex items-center space-x-4">
        <button>❤️</button>
        <button>💬</button>
        {isAuthenticated && (
          <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
