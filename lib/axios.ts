import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 2FA missing error
    if (
      error.response?.status === 400 &&
      error.response?.headers?.['x-authentication-error'] === '2fa-missing'
    ) {
      // Set flag in localStorage to show 2FA screen
      localStorage.setItem('require_2fa', 'true');

      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?require2fa=true';
      }

      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
