// src/components/BottomNav.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white fixed bottom-0 left-0 right-0 shadow-md flex justify-around p-4 z-10">
       
      <button onClick={() => navigate('/reconocemos')}>🌟</button>

      <button onClick={() => navigate('/permiso-temporal')}>📝</button> {/* Botón para PermisoTemporal */}
      <button onClick={() => navigate('/how-are-you')}>🙂</button> {/* Botón para HowAreYou */}

      <button onClick={() => navigate('/login')}>👤</button>
      <button onClick={() => navigate('/registro')}>📋</button> {/* Botón de registro */}

    </nav>
  );
};

export default BottomNav;
