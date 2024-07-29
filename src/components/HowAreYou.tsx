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
   
      
      <h2 className="text-3xl mt-8 mb-4 font-semibold font-montserrat">¿Ya llegaste a la Distri?</h2>
      <span  className="text-1xl mb-4 font-semibold font-montserrat">Paso 1: Marca tu entrada o Salida</span>
      <Presentismo />
      <span  className="text-1xl mb-4 font-semibold items-center justify-center font-montserrat">Paso 3: presiona sobre la imágen</span>

      <span  className="text-1xl mb-4 font-semibold font-montserrat">Paso 4: Listo!</span>
     
    </div>
  );
};

export default HowAreYou;
