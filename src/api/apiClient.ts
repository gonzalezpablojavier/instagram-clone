import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // URL del backend
  withCredentials: true, // Asegúrate de que esto esté configurado si estás usando cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
