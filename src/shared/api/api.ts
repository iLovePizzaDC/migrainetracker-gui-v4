import { fetchUserLogout } from '@/shared/api/user.api';
import { GOOGLE_TOKEN_EXPIRED } from '@/shared/constants/api/exceptions';
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

let isRefreshing = false;
let failedQueue: Array<{
  onSuccess: (value?: unknown) => void;
  onError: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, value?: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.onError(error);
    } else {
      prom.onSuccess(value);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data?.error === GOOGLE_TOKEN_EXPIRED) {
      await fetchUserLogout();
      return Promise.reject(error);
    }

    const isRefreshOrMeRequest =
      originalRequest.url?.includes('auth/refresh') || originalRequest.url?.includes('auth/me');

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshOrMeRequest) {
      if (isRefreshing) {
        return new Promise((onSuccess, onError) => {
          failedQueue.push({ onSuccess, onError });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        api
          .post('auth/refresh', {}, { withCredentials: true })
          .then(() => {
            processQueue(null);
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);
