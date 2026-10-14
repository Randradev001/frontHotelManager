import axios from 'axios';

const developmentApiUrl = `${window.location.protocol}//${window.location.hostname}:3000`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/' : developmentApiUrl),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
