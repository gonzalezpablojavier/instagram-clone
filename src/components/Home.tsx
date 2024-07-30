import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HowAreYou from './HowAreYou';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
 
  const [profile, setProfile] = useState<any>(null);
  const [lastMood, setLastMood] = useState<any>(null);
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);
  const [presentTime, setPresentTime] = useState<any>(null);
  const [solicitud, setSolicitud] = useState<any>(null);
  const API_URL = process.env.REACT_APP_API_URL;


  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  
  useEffect(() => {
    const colaboradorID = localStorage.getItem('colaboradorID');
    if (colaboradorID) {
      setColaboradorID(colaboradorID);
    }
  }, []);
 
  useEffect(() => {
   
    // Fetch profile data
    const fetchProfile = async () => {       
        console.log('Realizando solicitud de perfil para colaboradorID:', colaboradorID);     
        try {
       
            const response = await axios.get(`${API_URL}/usuarios-registrados/${colaboradorID}`);
            if (response.data.ok === 1) {
              setProfile(response.data.data);
            } else {
              console.error('Error fetching profile data:', response.data.message);
            }
          } catch (error) {
            console.error('Error fetching profile data:', error);
          }
      
    };

    // Fetch last mood
    const fetchLastMood = async () => {
     
        try{        
            const response = await axios.get(`${API_URL}/howareyou/${colaboradorID}/last`);
            if (response.data.ok ===1) {
                setLastMood(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching mood data:', error);
        }
      
    };

    // Fetch present time
    const fetchPresentTime = async () => {
     
        const response = await axios.get(`${API_URL}/presentismo/${colaboradorID}/last`);
        if (response.data.ok===1) {
          setPresentTime(response.data.data);
        }
     
    };

      // Fetch present time
      const fetchSolicitud = async () => {
     
        const response = await axios.get(`${API_URL}/permiso-temporal/latest/${colaboradorID}`);
        
          setSolicitud(response.data);
        
     
    };
    fetchSolicitud();
    fetchProfile();
    fetchLastMood();
    fetchPresentTime();
  }, [colaboradorID]);

  const renderMoodIcon = (mood: string) => {
    if (mood === 'muy bien') {
      return <button className="text-4xl">😎</button>;
    } else if (mood === 'bien') {
      return <button className="text-4xl">😊</button>;
    } else if (mood === 'normal') {
      return <button className="text-4xl">😢</button>;
    } else if (mood === 'mal') {
      return <button className="text-4xl">🤐</button>;
    } else {
      return <p className="text-4xl">{mood}</p>;
    }
  };
  const getBgColor = (estado: string | undefined) => {
    switch (estado) {
      case 'Aprobado':
        return 'bg-green-500';
      case 'Rechazado':
        return 'bg-red-500';
      case 'Evaluando':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
         {profile && profile.nombre ? (
   <div></div>
      ):(     <div className="w-full max-w-5xl mx-auto mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <p className="font-bold">Atención</p>
        <p>Por favor, completa tus datos de registro en el perfil para una mejor experiencia.</p>
      </div>)}
   
      <main className="flex-grow mt-16 w-full max-w-5xl mx-auto">
       
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-cyan-600 text-white p-4 rounded shadow flex items-center justify-center">
          {profile && profile.foto ? (
              <img 
                src={profile.foto} 
                alt="Foto de perfil" 
                className="w-24 h-24 object-cover rounded-full"
              />
            ) : (
              <img 
                src="/images/winner.png" 
                alt="Foto por defecto" 
                className="w-24 h-24 object-cover rounded-full"
              />
            )}      
             
          </div>
          <div className="bg-cyan-600 text-white p-4 rounded shadow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4 font-montserrat">Bienvenido</h2>
          <div className="flex space-x-4">
          <h2 className="text-3xl font-semibold mb-4 font-montserrat">{profile ? ` ${profile.nombre}` : ''}</h2>
          </div>
          </div>


          
          <div className="bg-amber-400 text-white p-4 rounded shadow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4 font-montserrat">¿Llegaste a la ofi?</h2> 
          <div className="flex space-x-8">
            <span className="text-1xl font-semibold mb-4 text-center items-center justify-center font-montserrat">{presentTime ? ` ${presentTime.tipo}` : ''}</span>
           </div>
            <div className="flex space-x-8">         
            <h2 className="text-2xl font-semibold mb-4 text-center items-center justify-center font-montserrat">{presentTime ? ` ${formatDateTime(presentTime.horaRegistro)}` : ''}</h2>
            </div>   
          </div>
   
          <div className={`${getBgColor(solicitud?.autorizado)} text-white p-4 rounded shadow flex flex-col items-center justify-center`}>
       
          <div className="flex space-x-4">
          <img src="/images/airport.svg" width={38}></img>
            </div> 
            <div className="flex space-x-8">         
                <h2 className="text-2xl font-semibold mb-4 text-center items-center justify-center font-montserrat">{solicitud ? ` ${solicitud.autorizado}` : ''}</h2>
            </div>   
            <div className="flex space-x-8">         
              </div>  
          </div>

          <div className="bg-cyan-600 text-white p-4 rounded shadow flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold mb-4 font-montserrat">Colecta Día de la Niñez</h1> 
          <div className="flex space-x-8">      
            <h2 className="text-4xl font-semibold mb-4 text-center items-center justify-center font-lato text-blue-900">Un juguete x una sonrisa</h2>
            </div>   
          </div>


        </div>
      </main>

    </div>
  );
};

export default Home;
