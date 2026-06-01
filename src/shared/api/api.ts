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
	onSuccess: (token: string) => void;
	onError: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.onError(error);
		} else {
			prom.onSuccess(token || '');
		}
	});
	failedQueue = [];
};

api.interceptors.request.use(
	(config) => {
		const token = sessionStorage.getItem('authToken');
		const expiry = sessionStorage.getItem('authTokenExpiry');

		if (token && expiry && Date.now() < Number(expiry)) {
			config.headers.Authorization = `Bearer ${token}`;
		} else if (expiry && Date.now() >= Number(expiry)) {
			sessionStorage.removeItem('authToken');
			sessionStorage.removeItem('authTokenExpiry');
		}

		return config;
	},
	(error) => Promise.reject(error),
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const originalRequest = error.config;

		const isRefreshOrMeRequest =
			originalRequest.url?.includes('auth/refresh') || originalRequest.url?.includes('auth/me');

		if (error.response?.status === 401 && !originalRequest._retry && !isRefreshOrMeRequest) {
			if (isRefreshing) {
				return new Promise((onSuccess, onError) => {
					failedQueue.push({ onSuccess, onError });
				})
					.then((token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			return new Promise((resolve, reject) => {
				api
					.post('auth/refresh', {}, { withCredentials: true })
					.then((response) => {
						const newToken = response.data.accessToken;
						const expiryTime = response.data.expiresIn
							? Date.now() + response.data.expiresIn * 1000
							: Date.now() + 60 * 60 * 1000;

						sessionStorage.setItem('authToken', newToken);
						sessionStorage.setItem('authTokenExpiry', expiryTime.toString());

						api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
						originalRequest.headers.Authorization = `Bearer ${newToken}`;

						processQueue(null, newToken);
						resolve(api(originalRequest));
					})
					.catch((err) => {
						processQueue(err, null);
						sessionStorage.clear();
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
