import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      setSuccessMessage('Login exitoso!');
      setError('');
    } else {
      setError('Credenciales inválidas');
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-600 bg-cover bg-center">
     
          <form 
        onSubmit={handleSubmit} 
        className="bg-cyan-600 p-8 rounded-lg  w-80 space-y-4 animate__animated animate__backInRight"
      >
      
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
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
