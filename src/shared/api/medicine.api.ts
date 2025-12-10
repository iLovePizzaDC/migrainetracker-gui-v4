import { api } from '@/shared/api/api';
import type { Medicine } from '@/shared/types/user/medicine';

export const fetchUserMedicinesGet = async (userId: string): Promise<Medicine[]> => {
    const response = await api.get('UserMedicine', { params: { googleUserId: userId } });
    return response.data;
};

export const fetchUserMedicinesPost = async (name: string, abbreviation: string, type: string, userId: string): Promise<Medicine> => {
    const response = await api.post(
        'UserMedicine',
        { googleUserId: userId },
        { params: { name, abbreviation: abbreviation.toLowerCase(), type } }
    );
    return response.data;
};

export const fetchUserMedicinesDelete = async (name: string, abbreviation: string, userId: string): Promise<Medicine[]> => {
    const response = await api.delete('UserMedicine', {
        params: { name, abbreviation },
        data: { googleUserId: userId },
    });
    return response.data;
};
