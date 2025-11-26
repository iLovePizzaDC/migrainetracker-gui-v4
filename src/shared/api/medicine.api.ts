import { api } from './api';

export const fetchUserMedicinesGet = async (userId: string) => {
    const response = await api.get('/UserMedicine', { params: { googleUserId: userId } });
    return response.data;
};

export const fetchUserMedicinesPost = async (name: string, abbreviation: string, type: string, userId: string) => {
    const response = await api.post(
        'UserMedicine',
        { googleUserId: userId },
        { params: { name, abbreviation: abbreviation.toLowerCase(), type } }
    );
    return response.data;
};

export const fetchUserMedicinesDelete = async (name: string, abbreviation: string, userId: string) => {
    const response = await api.delete('UserMedicine', {
        params: { name, abbreviation },
        data: { googleUserId: userId },
    });
    return response.data;
};
