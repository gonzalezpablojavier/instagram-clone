import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Route } from '../config/permissions';
import axios from 'axios';
const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second



  const attemptLogin = async (retries = 0): Promise<void> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { colaboradorID, access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      login(colaboradorID);
      navigate(Route.Home);
    } catch (err) {
      if (retries < MAX_RETRIES) {
        setError(`Intento ${retries + 1} fallido. Reintentando...`);
        setTimeout(() => attemptLogin(retries + 1), RETRY_DELAY);
      } else {
        setError('Credenciales inválidas después de múltiples intentos');
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    await attemptLogin();
    setIsLoading(false);
  


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-600 bg-cover bg-center">
      <form
        onSubmit={handleSubmit}
        className="bg-cyan-600 p-8 rounded-lg w-80 space-y-4 animate__animated animate__backInRight"
      >
        {error && <p className="text-red-500">{error}</p>}
        <img src="/images/logo-head.png" alt="Logo" className="mx-auto mb-8" />
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 font-montserrat"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 font-montserrat"
          required
        />
        <button type="submit" className="w-full p-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition duration-200 font-montserrat">
          Iniciar
        </button>
      </form>
    </div>
  );
};

export default Login;