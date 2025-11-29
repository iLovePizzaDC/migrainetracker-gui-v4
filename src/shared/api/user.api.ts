import type { User } from "../types";
import { api } from './api';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchUserLogin = async (code: string) => {
    const response = await api.post('auth/google', { code });
    return response.data;
};

export const fetchUserLogout = async () => {
    await api.post('auth/logout');
    sessionStorage.clear();
    window.location.href = BASE_URL;
};

export const fetchUserInformation = async () => {
    const response = await api.get('auth/me');
    return response.data;
};

export const fetchNewUser = async (user: User) => {
    const response = await api.post(
        'User',
        { googleUserId: user.id },
        {
            params: {
                email: user.email,
                lastName: user.family_name,
                firstName: user.name
            }
        }
    );
    return response.data;
};

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
            params: { planId, subscriptionId }
        }
    );
    return response.data;
};
