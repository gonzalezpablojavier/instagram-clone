import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://elated-kowalevski.51-222-158-198.plesk.page',
  withCredentials: true, // Asegura que las credenciales se envíen con cada solicitud
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
