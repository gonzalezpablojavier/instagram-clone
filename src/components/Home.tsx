import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HowAreYou from './HowAreYou';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [lastMood, setLastMood] = useState<any>(null);
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);
  const [presentTime, setPresentTime] = useState<string | null>(null);
  const API_URL = process.env.REACT_APP_API_URL;
  
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
      if (user && user.username) {
        const response = await axios.get(`${API_URL}/presentismo/${colaboradorID}/last`);
        if (response.data && response.data.time) {
          setPresentTime(response.data.time);
        }
      }
    };

    fetchProfile();
    fetchLastMood();
  //  fetchPresentTime();
  }, [colaboradorID]);

  const renderMoodIcon = (mood: string) => {
    if (mood === 'super') {
      return <button className="text-4xl">😎</button>;
    } else if (mood === 'contento') {
      return <button className="text-4xl">😊</button>;
    } else if (mood === 'triste') {
      return <button className="text-4xl">😢</button>;
    } else if (mood === 'enojado') {
      return <button className="text-4xl">😠</button>;
    } else if (mood === 'mal') {
      return <button className="text-4xl">🤐</button>;
    } else {
      return <p className="text-4xl">{mood}</p>;
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
   
      <main className="flex-grow mt-16 w-full max-w-5xl mx-auto">
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-cyan-600 text-white p-4 rounded shadow flex items-center justify-center">
            {profile ? <img src="/images/winner.png" alt="Perfil" className="w-24 h-24 object-cover rounded-full"/>  : 'Foto de perfil'}       
             
          </div>
          <div className="bg-cyan-600 text-white p-4 rounded shadow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4 font-montserrat">Bienvenido</h2>
          <div className="flex space-x-4">
          <h2 className="text-3xl font-semibold mb-4 font-montserrat">{profile ? ` ${profile.nombre}` : ''}</h2>
          </div>
          </div>

          <div className="bg-cyan-600 text-white p-4 rounded shadow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4 font-montserrat">¿Cómo te sentis hoy?</h2>         
            <div className="flex space-x-4">
            {lastMood && renderMoodIcon(lastMood.mood)}
            </div>            
          </div>

          
          <div className="bg-amber-400 text-white p-4 rounded shadow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold mb-4 font-montserrat">¿Llegaste a la ofi?</h2> 
          <div className="flex space-x-8">
            {presentTime && <p className="text-lg">{presentTime}</p>}
            <h2 className="text-4xl font-semibold mb-4 font-montserrat">08:02</h2>
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
