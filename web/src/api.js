import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Interceptor pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor pour rafraîchir le token automatiquement si 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
          const res = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
          localStorage.setItem('access_token', res.data.access);
          originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access;
          return api(originalRequest);
        }
      } catch (e) {
        // Token refresh failed, logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 