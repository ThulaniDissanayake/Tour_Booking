import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    
    const url = `${config.baseURL || ''}${config.url || ''}`;
    if (url.includes('/auth/login')) return config;

    let token = localStorage.getItem('token');
    if (token === 'null' || token === 'undefined') token = null;

    if (token) {
      
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else if (config.headers?.Authorization) {
  
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;