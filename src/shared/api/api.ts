import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ENDPOINT_BASE_URL;
const API_URL_SUFFIX = import.meta.env.VITE_API_URL_SUFFIX;

export const api = axios.create({
    baseURL: `${BASE_URL}${API_URL_SUFFIX}`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);
