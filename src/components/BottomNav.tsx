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
      <div className="flex flex-col items-center" onClick={() => navigate('/presentismo')}>
        <button>📅</button>
        <span className="text-xs">Presentismo</span>
      </div>
  
      <div className="flex flex-col items-center" onClick={() => navigate('/permiso-temporal')}>
        <button>📝</button>
        <span className="text-xs">Permiso</span>
      </div>


      <div className="flex flex-col items-center" onClick={() => navigate('/how-are-you')}>
        <button>🙂</button>
        <span className="text-xs">Como Estas Hoy?</span>
      </div>
      {!isAuthenticated && <button onClick={() => navigate('/login')}>👤</button>}
     


      <div className="flex flex-col items-center" onClick={() => navigate('/registro')}>
        <button>📋</button>
        <span className="text-xs">Mi Info</span>
      </div>

    </nav>
  );
};

export default BottomNav;
