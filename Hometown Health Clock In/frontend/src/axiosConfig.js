// axiosConfig.js
import axios from 'axios';

// Set up the request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up the response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to sign-in page if unauthorized
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axios;
