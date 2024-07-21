import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://rrhh-back.onrender.com',
  withCredentials: true, // Asegura que las credenciales se envíen con cada solicitud
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
