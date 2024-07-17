// src/components/Applications.tsx
import React from 'react';

const applications = [
  { name: 'Archivo', icon: '📁', path: '/archivo' },
  { name: 'Formularios', icon: '📝', path: '/formularios' },
  { name: 'Destacados', icon: '⭐', path: '/destacados' },
  { name: 'Salud', icon: '💊', path: '/salud' },
  { name: 'Recetas', icon: '🍽️', path: '/recetas' },
  { name: 'Academia', icon: '🎓', path: '/academia' },
  { name: 'Personal', icon: '👥', path: '/personal' },
  { name: 'Gimnasia', icon: '🏋️', path: '/gimnasia' },
];

const Applications: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="grid grid-cols-2 gap-4 p-4 bg-white shadow-md rounded-lg">
        {applications.map((app) => (
          <button 
            key={app.name} 
            onClick={() => alert(`Navegando a ${app.path}`)}
            className="flex items-center p-4 border rounded-lg shadow hover:bg-gray-200 transition"
          >
            <span className="text-2xl mr-4">{app.icon}</span>
            {app.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Applications;