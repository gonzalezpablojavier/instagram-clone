// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

  useEffect(() => {
    const storedNombreUsuario = localStorage.getItem('nombreUsuario');
    if (storedNombreUsuario) {
      setNombreUsuario(storedNombreUsuario);
    }
  }, []);

  return (
    <header className="bg-white p-4 shadow-md flex justify-between items-center fixed top-0 left-0 right-0 z-10 animate__animated animate__fadeInDown">
      <h1 className="text-xl font-bold">RRHH-DistriSuper</h1>
      <div className="flex items-center space-x-4">
      {nombreUsuario && <span className="text-lg">Hola!, {nombreUsuario}</span>}
       
        <button>❤️</button>
        
        {isAuthenticated && (
          <button onClick={logout} className="bg-blue-300 text-white p-2 rounded">
            Cerrar Sesión
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
