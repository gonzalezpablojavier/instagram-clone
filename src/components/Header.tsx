// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const storedNombreUsuario = localStorage.getItem('nombreUsuario');
    if (storedNombreUsuario) {
      setNombreUsuario(storedNombreUsuario);
    }
  }, []);

  return (
    <header className="bg-gray-100 p-4 shadow-md flex justify-between items-center fixed top-0 left-0 right-0 z-10 animate__animated animate__fadeInDown">
     
      <img  className="h-8" src="https://distrisuperapis.com.ar/images_rrhh/logo-head.png"></img>
      <div className="flex items-center space-x-4">         
      <div className="flex flex-col items-center" onClick={() => navigate('/registro')}>
      <button className=' text-2xl'>
            <img width="32px" src="https://distrisuperapis.com.ar/images_rrhh/user-4250.png"></img>
      </button>
    
      </div>
        {isAuthenticated && (
          <button onClick={logout} >
            <img width="32px" src="https://distrisuperapis.com.ar/images_rrhh/logout.png"></img>
          </button>
        )}


      
      </div>

     
    </header>
  );
};

export default Header;
