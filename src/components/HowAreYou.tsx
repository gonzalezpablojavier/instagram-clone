import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Presentismo from './Presentismo';

const HowAreYou: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const storedColaboradorID = localStorage.getItem('colaboradorID');
    if (storedColaboradorID) {
      setColaboradorID(storedColaboradorID);
    }
  }, []);

  const handleMoodClick = async (selectedMood: string) => {
    setMood(selectedMood);
    try {
      const response = await axios.post(`${API_URL}/howareyou`, { mood: selectedMood, colaboradorID });
      if (response.data.ok === 1) {
        setMessage('Estado de ánimo grabado exitosamente!');
      } else {
        setMessage('Hoy ya enviaste tu estado de ánimo!');
      }
    } catch (error) {
      setMessage('Error al guardar el estado de ánimo');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-2xl mb-4 font-semibold font-montserrat">¿Cómo te sentis hoy?</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col items-center">
          <button onClick={() => handleMoodClick('super')} className="text-4xl">😎</button>
          <span className="text-xs">MUY BIEN</span>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => handleMoodClick('contento')} className="text-4xl">😊</button>
          <span className="text-xs">BIEN</span>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => handleMoodClick('normal')} className="text-4xl">😐</button>
          <span className="text-xs">NORMAL</span>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => handleMoodClick('mal')} className="text-4xl">😢</button>
          <span className="text-xs">MAL</span>
        </div>
      </div>
      {mood && <p className="text-xl">Seleccionaste: {mood}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
      
      <h2 className="text-2xl mt-8 mb-4 font-semibold font-montserrat">¿Ya llegaste?</h2>
      <Presentismo />
      <span className="text-2xl mb-4 font-montserrat">acercate a tu QR más cercano</span>
    </div>
  );
};

export default HowAreYou;
