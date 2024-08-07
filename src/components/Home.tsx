import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [lastMood, setLastMood] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);
  const [presentTime, setPresentTime] = useState<any>(null);
  const [solicitud, setSolicitud] = useState<any>(null);
  const [solicitudVacaciones, setSolicitudVacaciones] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [felicitacionesDisponibles, setFelicitacionesDisponibles] = useState<number | null>(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const storedColaboradorID = localStorage.getItem('colaboradorID');
    if (storedColaboradorID) {
      setColaboradorID(storedColaboradorID);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!colaboradorID) return;

    try {
      const profileResponse = await axios.get(`${API_URL}/usuarios-registrados/${colaboradorID}`);
      if (profileResponse.data.ok === 1) {
        setProfile(profileResponse.data.data);
      }

      const moodResponse = await axios.get(`${API_URL}/howareyou/${colaboradorID}/last`);
      if (moodResponse.data.ok === 1) {
        setLastMood(moodResponse.data.data);
      }

      const presentTimeResponse = await axios.get(`${API_URL}/presentismo/${colaboradorID}/last`);
      if (presentTimeResponse.data.ok === 1) {
        setPresentTime(presentTimeResponse.data.data);
      }

      const solicitudResponse = await axios.get(`${API_URL}/permiso-temporal/latest/${colaboradorID}`);
      setSolicitud(solicitudResponse.data);

      const vacacionesResponse = await axios.get(`${API_URL}/vacaciones/latest/${colaboradorID}`);
      setSolicitudVacaciones(vacacionesResponse.data);

      const response = await axios.get(`${API_URL}/feedback/felicitaciones-disponibles/${colaboradorID}`);
      if (response.data.ok === 1) {
        setFelicitacionesDisponibles(response.data.data.disponibles);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [colaboradorID, API_URL]);

  useEffect(() => {
    if (colaboradorID) {
      fetchData();
      const intervalId = setInterval(() => {
        setRefreshKey(oldKey => oldKey + 1);
      }, 30000);
      return () => clearInterval(intervalId);
    }
  }, [colaboradorID, refreshKey, fetchData]);

  const handleMoodClick = async (selectedMood: string) => {
    try {
      const response = await axios.post(`${API_URL}/howareyou`, { mood: selectedMood, colaboradorID });
      if (response.data.ok === 1) {
        setMessage('Gracias por compartir!');
        setLastMood({ mood: selectedMood });
      } else {
        setMessage('Hoy ya enviaste tu estado de ánimo!');
      }
    } catch (error) {
      setMessage('Error al guardar el estado de ánimo');
      console.error(error);
    }
    
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const getBgColor = (estado: string | undefined) => {
    switch (estado) {
      case 'Aprobado': return 'bg-green-500';
      case 'Rechazado': return 'bg-red-500';
      case 'Evaluando': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const GridButton: React.FC<{
    bgColor: string,
    onClick: () => void,
    title: string,
    description: string,
    children: React.ReactNode,
    className?: string
  }> = ({ bgColor, onClick, title, description, children, className }) => (
    <div className={`flex flex-col ${className}`}>
      <button 
        onClick={onClick}
        className={`${bgColor} text-white p-3 md:p-4 rounded-xl shadow flex flex-col items-center justify-between w-full h-full`}
      >
        <div className="flex-grow flex items-center justify-center">
          {children}
        </div>
        <h2 className="text-xs md:text-sm font-semibold mt-2 text-center font-montserrat">
          {title}
        </h2>
      </button>
      {description && <p className="text-xs text-center mt-2 text-gray-600">{description}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {!profile?.nombre && (
        <div className="w-full max-w-5xl mx-auto mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Atención</p>
          <p>Por favor, completa tus datos de registro en el perfil para una mejor experiencia.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
        <GridButton 
          bgColor="bg-green-500" 
          onClick={() => {}}
          title="¿Cómo me siento?"
          description=""
          className="col-span-2"
        >
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="flex justify-center space-x-4 mb-2">
              {[
                { mood: 'contento', src: '/images/contento.svg' },               
                { mood: 'enojado', src: '/images/enojado.svg' },
                { mood: 'mal', src: '/images/triste.svg' }
              ].map(({ mood, src }) => (
                <button
                  key={mood}
                  onClick={() => handleMoodClick(mood)}
                  className={`transition-all duration-300 ${
                    lastMood && lastMood.mood === mood
                      ? 'transform scale-145'
                      : 'hover:transform hover:scale-105'
                  }`}
                >
                  <img
                    src={src}
                    alt={mood}
                    className="w-12 h-12 md:w-16 md:h-16"
                  />
                </button>
              ))}
            </div>
            {message && (
              <div className="mt-2 text-xs text-center font-semibold">
                {message}
              </div>
            )}
            {lastMood && (
              <div >
               
              </div>
            )}
          </div>
        </GridButton>

        <GridButton 
          bgColor="bg-cyan-600" 
          onClick={() => navigate('/FeedbackColaborador')}
          title={`Felicitar / Revisar (${felicitacionesDisponibles || 0})`}
          description=""
        >
          <span className="text-2xl md:text-3xl">
            <img src="/images/search-favorite-8979.png" alt="Felicitar / Revisar" />
          </span>
        </GridButton>

        <GridButton 
          bgColor={getBgColor(solicitud?.autorizado)} 
          onClick={() => navigate('/permiso-temporal')}
          title='Permiso Temporal'
          description=""
        >
          <img src="/images/airport.svg" className="w-6 h-6 md:w-8 md:h-8" alt="Permiso temporal" />
        </GridButton>

        <GridButton 
          bgColor={getBgColor(solicitudVacaciones?.autorizado)} 
          onClick={() => navigate('/vacaciones')}
          title={'Vacaciones'}
          description=""
        >
          <img src="/images/vacaciones.png" className="w-6 h-6 md:w-8 md:h-8" alt="Vacaciones" />
        </GridButton>

        <GridButton 
          bgColor="bg-cyan-500" 
          onClick={() => navigate('/reconocemos')}
          title="Ranking"
          description=""
        >
          <img src="/images/star.svg" className="w-6 h-6 md:w-8 md:h-8" alt="Ranking" />
        </GridButton>

        <GridButton 
          bgColor="bg-amber-400" 
          onClick={() => navigate('/Home')}
          title="¿Estás en la ofi?  proximamente...."
          description=""
        >
          <img src="/images/qr-code-scan-9795.png" className="w-6 h-6 md:w-8 md:h-8" alt="¿Estás en la ofi?" />
        </GridButton>
      </div>
    </div>
  );
};

export default Home;