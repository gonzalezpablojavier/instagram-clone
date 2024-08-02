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
    setMood(selectedMood);
    setSelectedEmoji(selectedMood);
    try {
      const response = await axios.post(`${API_URL}/howareyou`, { mood: selectedMood, colaboradorID });
      if (response.data.ok === 1) {
        setMessage('Gracias por compartir!');
     
      } else {
        setMessage('Hoy ya enviaste tu estado de ánimo!');
      }
    } catch (error) {
      setMessage('Error al guardar el estado de ánimo');
      console.error(error);
    }
     
    setTimeout(() => {
      setMessage(null);
      setSelectedEmoji(null);  // Resetear el emoji seleccionado después de 3 segundos
    }, 3000);
  };
  const renderMoodIcon = (mood: string) => {
    if (mood === 'contento') return "😊";
    if (mood === 'neutro') return "😐";
    if (mood === 'enojado') return "😠";
    if (mood === 'mal') return "😢";
    return mood;
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
    children: React.ReactNode
  }> = ({ bgColor, onClick, title, description, children }) => (
    <div className="flex flex-col items-center">
      <button 
        onClick={onClick}
        className={`${bgColor} text-white p-3 md:p-4 rounded-xl shadow flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105 aspect-square w-full`}
      >
        {children}
        <h2 className="text-xs md:text-sm font-semibold mt-2 text-center font-montserrat">
          {title}
        </h2>
      </button>
      <p className="text-xs text-center mt-2 text-gray-600">{description}</p>
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
   
      <main className="flex-grow mt-16 w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <GridButton 
            bgColor="bg-yellow-500" 
            onClick={()=>{}}
            title="¿Cómo me siento?"
            description=""
          >
                <div className="mb-6">
          
              <div className="flex justify-center space-x-2 ">
              {['contento', 'neutro', 'enojado', 'mal'].map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodClick(mood)}
                    className={`text-2xl transition-all duration-300 shadow-md ${
                      selectedEmoji === mood
                        ? 'transform scale-150'
                        : 'hover:transform hover:scale-110'
                    }`}
                  >
                    {renderMoodIcon(mood)}
                  </button>
                ))}
             
              </div>
            </div>
            {message && (
              <div className="mt-2 text-xs text-center font-semibold">
                {message}
              </div>
            )}
            {lastMood && (
              <div className="mt-2 text-xs text-center">
                
              </div>
            )}
          </GridButton>

          <GridButton 
            bgColor="bg-cyan-600" 
            onClick={() => navigate('/FeedbackColaborador')}
            title="Felicitar/Revisar"
            description=""
          >
            <span className="text-2xl md:text-3xl"><img src="/images/search-favorite-8979.png"></img></span>
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
            title={solicitudVacaciones ? solicitudVacaciones.autorizado : 'Vacaciones'}
            description=""
          >
            <img src="/images/vacaciones.png" className="w-6 h-6 md:w-8 md:h-8" alt="Vacaciones" />
          </GridButton>


          <GridButton 
            bgColor="bg-green-500" 
            onClick={() => navigate('/reconocemos')}
            title="Ranking"
            description=""
          >
            <img src="/images/star.svg" className="w-6 h-6 md:w-8 md:h-8" alt="Vacaciones" />
          </GridButton>
          <GridButton 
            bgColor="bg-amber-400" 
            onClick={() => navigate('/Home')}
            title="¿Estás en la ofi?"
            description="proximamente..."
          >
             <img src="/images/qr-code-scan-9795.png" className="w-6 h-6 md:w-8 md:h-8" alt="Vacaciones" />
          </GridButton>


        </div>
      </main>
    </div>
  );
};

export default Home;