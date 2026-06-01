import { api } from '@/shared/api/api';
import type { UserResponse } from '@/shared/api/types/user';

export const fetchUserLogin = async (code: string): Promise<UserResponse> => {
	const response = await api.post('auth/google', { code });

	if (response.data.accessToken) {
		sessionStorage.setItem('authToken', response.data.accessToken);

		const expiryTime = response.data.expiresIn
			? Date.now() + response.data.expiresIn * 1000
			: Date.now() + 60 * 60 * 1000;

		sessionStorage.setItem('authTokenExpiry', expiryTime.toString());
	}

	return response.data;
};

export const fetchUserLogout = async () => {
	try {
		await api.post('auth/logout');
	} finally {
		sessionStorage.clear();
		window.location.href = '/';
	}
};

export const fetchUserInformation = async (): Promise<UserResponse> => {
	const response = await api.get('auth/me');

	if (response.data.accessToken) {
		sessionStorage.setItem('authToken', response.data.accessToken);

		const expiryTime = response.data.expiresIn
			? Date.now() + response.data.expiresIn * 1000
			: Date.now() + 60 * 60 * 1000;

		sessionStorage.setItem('authTokenExpiry', expiryTime.toString());
	}

	return response.data;
};
