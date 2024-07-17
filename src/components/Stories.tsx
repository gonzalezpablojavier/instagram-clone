// src/components/Stories.tsx
import React from 'react';

const stories = [
  { id: 1, name: 'Fede', image: 'https://loremflickr.com/640/360' },
  { id: 2, name: 'Marcos', image: 'https://baconmockup.com/640/360' },
  { id: 3, name: 'Edu', image: 'https://placebear.com/640/360' },
  { id: 4, name: 'Agus', image: 'https://picsum.photos/640/360' },
  // Agrega más historias aquí
];

const Stories: React.FC = () => {
  return (
    <div className="flex space-x-4 overflow-x-scroll p-4 bg-white shadow-md">
      {stories.map(story => (
        <div key={story.id} className="flex flex-col items-center">
          <img src={story.image} alt={story.name} className="w-14 h-14 rounded-full" />
          <p className="text-xs mt-2">{story.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Stories;
