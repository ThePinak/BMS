import axios from 'react'; // wait, it's just axios
import axiosInstance from 'axios';

const api = axiosInstance.create({
    baseURL: 'https://pinak-bank-management.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor to inject JWT token on every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('bank_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
