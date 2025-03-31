import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'https://anony-backend-1.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token (if available)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
