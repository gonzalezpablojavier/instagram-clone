import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;
const apiClient = axios.create({
  baseURL: `${API_URL}`,
  //baseURL: 'http://localhost:3000',
  withCredentials: true, // Asegura que las credenciales se envíen con cada solicitud
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
