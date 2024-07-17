// src/components/HowAreYou.tsx
import React, { useState } from 'react';

const moodOptions = [
  { mood: 'Contento', icon: '😊' },
  { mood: 'Triste', icon: '😢' },
  { mood: 'Enojado', icon: '😠' },
  { mood: 'Super', icon: '😎' },
  { mood: 'No quiero decirlo', icon: '🤐' },
];

const HowAreYou: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toLocaleDateString());

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      console.log(`Mood: ${selectedMood}, Date: ${date}`);
      // Aquí puedes agregar la lógica para enviar los datos al servidor
      alert(`Estado de ánimo guardado: ${selectedMood} en la fecha: ${date}`);
    } else {
      alert('Por favor selecciona un estado de ánimo.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl mb-4">¿Cómo te sientes hoy?</h2>
      <div className="flex space-x-4 mb-4">
        {moodOptions.map((option) => (
          <button
            key={option.mood}
            onClick={() => handleMoodSelect(option.mood)}
            className={`p-4 rounded-full text-3xl ${
              selectedMood === option.mood ? 'bg-blue-300' : 'bg-gray-200'
            }`}
          >
            {option.icon}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Grabar Estado
      </button>
    </div>
  );
};

export default HowAreYou;
