// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white p-4 shadow-md flex justify-between items-center fixed top-0 left-0 right-0 z-10">
      <h1 className="text-xl font-bold">Cultura DistriSuper</h1>
      <div className="flex items-center space-x-4">
        <button>❤️</button>
        <button>💬</button>
      
      </div>
    </header>
  );
};

export default Header;
