import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Presentismo from './Presentismo';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

const HowAreYou: React.FC = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
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
        setCurrentStep(4);
      } else {
        setMessage('Hoy ya enviaste tu estado de ánimo!');
      }
    } catch (error) {
      setMessage('Error al guardar el estado de ánimo');
      console.error(error);
    }
  };

  const steps = [
    { number: 1, title: "Marca tu entrada o salida" },   
    { number: 2, title: "Presiona sobre la imagen QR" },
    { number: 3, title: "¡Listo!" }
  ];

  const renderStepIndicator = (stepNumber: number, title: string) => (
    <div className="flex items-center text-blue-600">
      <div className="flex items-center justify-center w-8 h-8 border-2 border-blue-600 bg-blue-100 rounded-full mr-2">
        <CheckCircleIcon className="w-6 h-6" />
      </div>
      <span className="text-sm font-semibold">{title}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h2 className="text-3xl mt-8 mb-6 font-semibold font-montserrat text-blue-800">¿Ya llegaste a la Distri?</h2>
      
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6">
        <div className="flex flex-wrap justify-between mb-8">
            {steps.map((step) => (
              <div key={step.number} className="w-full sm:w-auto mb-4 sm:mb-0">
                {renderStepIndicator(step.number, step.title)}
              </div>
            ))}
          </div>
          
          {currentStep === 1 && (
            <div className="mb-6">
              <Presentismo />
             
               
            </div>
          )}

<div className="flex justify-center space-x-4">
 <span  className="text-1xl mb-4 font-semibold items-center justify-center font-montserrat">acercate a tu QR más cercano</span>
   </div>  
          {currentStep === 5 && (
            <div className="mb-6">
              <h3 className="text-xl mb-4 font-semibold text-gray-700">¿Cómo te sientes hoy?</h3>
              <div className="flex justify-center space-x-4">
                <button onClick={() => handleMoodClick('muy bien')} className="text-4xl hover:transform hover:scale-110 transition duration-300">😎</button>
                <button onClick={() => handleMoodClick('bien')} className="text-4xl hover:transform hover:scale-110 transition duration-300">😊</button>
                <button onClick={() => handleMoodClick('normal')} className="text-4xl hover:transform hover:scale-110 transition duration-300">😐</button>
                <button onClick={() => handleMoodClick('mal')} className="text-4xl hover:transform hover:scale-110 transition duration-300">😢</button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="mb-6 text-center">
              <p className="text-lg text-gray-700 mb-4">Presiona sobre la imagen para registrar tu estado de ánimo</p>
              <button 
                onClick={() => setCurrentStep(4)} 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Registrar
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-semibold text-green-600 mb-4">¡Listo!</h3>
              <p className="text-lg text-gray-700">{message}</p>
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mt-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowAreYou;