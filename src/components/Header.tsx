// src/components/Header.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [colaboradorID, setColaboradorID] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedColaboradorID = localStorage.getItem('colaboradorID');
    console.log('Stored colaboradorID:', storedColaboradorID);
    if (storedColaboradorID) {
      setColaboradorID(storedColaboradorID);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!colaboradorID) {
      console.log('No colaboradorID available');
      return;
    }
    try {
      console.log('Fetching profile data for colaboradorID:', colaboradorID);
      const profileResponse = await axios.get(`${API_URL}/usuarios-registrados/${colaboradorID}`);
      console.log('Profile response:', profileResponse.data);
      if (profileResponse.data.ok === 1) {
        setProfile(profileResponse.data.data);
      } else {
        console.error('Error in profile response:', profileResponse.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }, [colaboradorID, API_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  console.log('Current profile state:', profile);

  return (
    <header className="bg-gray-100 p-4 shadow-md flex justify-between items-center fixed top-0 left-0 right-0 z-10 animate__animated animate__fadeInDown">
      <img className="h-8" src="https://distrisuperapis.com.ar/images_rrhh/logo-head.png" alt="Logo" />
      
      <div className="flex items-center space-x-4">
        {profile ? (
          <>
            <span className="text-sm font-semibold font-montserrat">Hola! {profile.nombre}</span>
            <div className="flex items-center" onClick={() => navigate('/registro')}>
              <img
                src={profile.foto || "https://distrisuperapis.com.ar/images_rrhh/user-4250.png"}
                alt={profile.foto ? "Foto de perfil" : "Foto por defecto"}
                className="w-8 h-8 object-cover rounded-full cursor-pointer"
              />
            </div>
          </>
        ) : (
          <span>Cargando perfil...</span>
        )}
        {isAuthenticated && (
          <button onClick={logout} className="ml-2">
            <img width="32px" src="https://distrisuperapis.com.ar/images_rrhh/logout.png" alt="Logout" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;