// src/components/BottomNav.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white fixed bottom-0 left-0 right-0 shadow-md flex justify-around p-4 z-10">
      <button onClick={() => navigate('/')}>🏠</button>
      <button onClick={() => navigate('/search')}>🔍</button>
      <button onClick={() => navigate('/new')}>➕</button>
      <button onClick={() => navigate('/likes')}>❤️</button>
      <button onClick={() => navigate('/login')}>👤</button>
    </nav>
  );
};

export default BottomNav;
