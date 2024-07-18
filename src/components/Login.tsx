// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      setSuccessMessage('Login exitoso!');
      setError('');
    } else {
      setError('Credenciales inválidas');
      setSuccessMessage('');
    }
  };

  return (
  
      <div className="min-h-screen flex items-center justify-center bg-login-background bg-cover bg-center">

      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded shadow-md w-80 space-y-4 animate__animated animate__backInRight"
      >
        <h2 className="text-2xl mb-4">Iniciar Sesión</h2>
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 w-full border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 w-full border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
