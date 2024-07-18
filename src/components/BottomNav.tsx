// src/components/BottomNav.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (

       <nav className="bg-white fixed bottom-0 left-0 right-0 shadow-md flex justify-around p-4 z-10 animate__animated animate__fadeInUp">
   
      {/*<button onClick={() => navigate('/reconocemos')}>🌟</button>*/}
      <button onClick={() => navigate('/presentismo')}>📅</button> {/* Botón para Presentismo */}
  
      <button onClick={() => navigate('/permiso-temporal')}>📝</button> {/* Botón para PermisoTemporal */}
      <button onClick={() => navigate('/how-are-you')}>🙂</button> {/* Botón para HowAreYou */}
      {!isAuthenticated && <button onClick={() => navigate('/login')}>👤</button>}
     
      <button onClick={() => navigate('/registro')}>📋</button> {/* Botón de registro */}

    </nav>
  );
};

export default BottomNav;
