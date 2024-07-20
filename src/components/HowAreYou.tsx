import React, { useState,useEffect } from 'react';
import axios from 'axios';

const HowAreYou: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);



  useEffect(() => {
    const storedColaboradorID = localStorage.getItem('colaboradorID');
    if (storedColaboradorID) {
      setColaboradorID(storedColaboradorID);
    }
  }, []);

  const handleMoodClick = async (selectedMood: string) => {
    setMood(selectedMood);
    try {
      const response = await axios.post('http://localhost:3000/howareyou', { mood: selectedMood, colaboradorID });
      if (response.status === 201) {
        setMessage('Estado de ánimo guardado correctamente');
      }
    } catch (error) {
      setMessage('Error al guardar el estado de ánimo');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl mb-4">¿Cómo te sentis hoy?</h2>
      <div className="flex space-x-4 mb-4">
        <button onClick={() => handleMoodClick('super')} className="text-4xl">😎</button>
        <button onClick={() => handleMoodClick('contento')} className="text-4xl">😊</button>
        <button onClick={() => handleMoodClick('triste')} className="text-4xl">😢</button>
        <button onClick={() => handleMoodClick('enojado')} className="text-4xl">😠</button>  
        <button onClick={() => handleMoodClick('no quiero decirlo')} className="text-4xl">🤐</button>
      </div>
      {mood && <p className="text-xl">Seleccionaste: {mood}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
};

export default HowAreYou;
