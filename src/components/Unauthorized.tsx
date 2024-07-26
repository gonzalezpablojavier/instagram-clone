// src/components/Unauthorized.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">No tienes permiso para acceder a esta página</h1>
      <Link to="/" className="text-blue-500 hover:text-blue-700">Volver a la página principal</Link>
    </div>
  );
};

export default Unauthorized;