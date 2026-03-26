import { api } from '@/shared/api/api';
import type { UserResponse } from '@/shared/api/types/user';

export const fetchUserLogin = async (code: string): Promise<UserResponse> => {
	const response = await api.post('auth/google', { code });
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
	return response.data;
};
