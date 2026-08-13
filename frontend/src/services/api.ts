import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically inject tokens before every API call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['X-Admin-Token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Automatically log out if token is invalid/expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      // If we are on /admin/login, don't trigger redirect loops
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Common HTTP wrapper methods to simplify endpoint calling
export const httpGet = async (endpoint: string, params?: any) => {
  const response = await api.get(endpoint, { params });
  return response.data;
};

export const httpPost = async (endpoint: string, data?: any) => {
  const response = await api.post(endpoint, data);
  return response.data;
};

export const httpPut = async (endpoint: string, data?: any) => {
  const response = await api.put(endpoint, data);
  return response.data;
};

export const httpDelete = async (endpoint: string) => {
  const response = await api.delete(endpoint);
  return response.data;
};

export default api;
