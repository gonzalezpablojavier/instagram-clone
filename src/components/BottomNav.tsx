// src/components/BottomNav.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (

       <nav className="bg-blue-950 fixed bottom-0 left-0 right-0 shadow-md flex justify-around p-4 z-10 animate__animated animate__fadeInUp">
   
      {/*<button onClick={() => navigate('/reconocemos')}>🌟</button>*/}
   

   
  
      <div className="flex flex-col items-center" onClick={() => navigate('/permiso-temporal')}>

      <img src="/images/airport.svg" width={38}></img>
      </div>

      <div className="flex flex-col items-center" onClick={() => navigate('/home')}>
      <button className='text-2xl'>
          <img src="/images/home.svg" width="48x"></img>
      </button>
 
      </div>

      <div className="flex flex-col items-center" onClick={() => navigate('/how-are-you')}>
        <button className='text-2xl'> 
        <img src="/images/star.svg" width={38}></img>   
        </button>   
      </div>
      {!isAuthenticated && <button onClick={() => navigate('/login')}>👤</button>}
     


    </nav>
  );
};

export default BottomNav;
