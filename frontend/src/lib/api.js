import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ct_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register' && path !== '/') {
        localStorage.removeItem('ct_token');
        localStorage.removeItem('ct_user');
      }
    }
    return Promise.reject(err);
  }
);

export const apiErr = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.error || err?.message || fallback;
