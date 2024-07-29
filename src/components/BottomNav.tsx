import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Route } from '../config/permissions';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, hasPermission } = useAuth();

  const navItems = [
    { path: Route.PermisoTemporal, icon: '/images/airport.svg', alt: 'Permiso temporal' },
    { path: Route.Home, icon: '/images/home.svg', alt: 'Home' },
    { path: Route.HowAreYou, icon: '/images/star.svg', alt: 'How are you' },
    { path: Route.PanelPermisosTemporales, icon: '/images/key.png', alt: 'Panel Permisos' },
  
  ];

  const isActive = (path: Route) => location.pathname === path;

  return (
    <nav className="bg-blue-950 shadow-md flex lg:flex-col justify-around p-4 z-10 fixed bottom-0 left-0 right-0 lg:top-0 lg:bottom-0 lg:w-20 lg:h-screen">
      {navItems.map((item) => (
        hasPermission(item.path) && (
          <div 
            key={item.path}
            className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
              isActive(item.path) ? 'scale-110 bg-blue-800 rounded-full p-2' : 'hover:bg-blue-900 rounded-full p-2'
            }`}
            onClick={() => navigate(item.path)}
          >
            <img src={item.icon} width={38} alt={item.alt} />
            {isActive(item.path) && (
              <div className="w-2 h-2 bg-white rounded-full mt-1" />
            )}
          </div>
        )
      ))}
      {!isAuthenticated && (
        <div 
          className={`flex flex-col items-center cursor-pointer ${
            isActive(Route.Login) ? 'scale-110 bg-blue-800 rounded-full p-2' : 'hover:bg-blue-900 rounded-full p-2'
          }`}
          onClick={() => navigate(Route.Login)}
        >
          <button className='text-2xl'>👤</button>
          {isActive(Route.Login) && (
            <div className="w-2 h-2 bg-white rounded-full mt-1" />
          )}
        </div>
      )}
    </nav>
  );
};

export default BottomNav;