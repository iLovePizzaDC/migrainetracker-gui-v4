import { api } from '@/shared/api/api';
import type { Medicine } from '@/shared/types/user/medicine';

export const fetchUserMedicinesGet = async (): Promise<Medicine[]> => {
    const response = await api.get('UserMedicine');
    return response.data;
};

export const fetchUserMedicinesPost = async (name: string, abbreviation: string, type: string): Promise<Medicine> => {
    const response = await api.post(`UserMedicine?name=${name}&abbreviation=${abbreviation}&type=${type}`);
    return response.data;
};

export const fetchUserMedicinesDelete = async (name: string, abbreviation: string): Promise<Medicine[]> => {
    const response = await api.delete(`UserMedicine?name=${name}&abbreviation=${abbreviation}`);
    return response.data;
};
