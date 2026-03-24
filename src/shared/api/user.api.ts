import { api } from '@/shared/api/api';
import type { UserResponse } from '@/shared/api/types/user';
import type { User } from '@/shared/types/user/user';

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

export const fetchUserInformation = async (): Promise<User> => {
	const response = await api.get('auth/me');
	return response.data;
};

export const fetchNewUser = async (user: User): Promise<User> => {
	const response = await api.post(
		'User',
		{ googleUserId: user.id },
		{
			params: {
				email: user.email,
				lastName: user.family_name,
				firstName: user.name,
			},
		},
	);
	return response.data;
};

// TODO add response types
export const fetchUserPremiumGet = async (userId: string) => {
	const response = await api.get('PremiumUser', { params: { googleUserId: userId } });
	return response.data;
};

export const fetchUserPremiumPost = async (userId: string) => {
	const response = await api.post('PremiumUser', { googleUserId: userId });
	return response.data;
};

export const fetchOrder = async (planId: number, subscriptionId: string, userId: string) => {
	const response = await api.post(
		'Order',
		{ googleUserId: userId },
		{
			params: { planId, subscriptionId },
		},
	);
	return response.data;
};
