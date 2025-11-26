const BASE_URL = import.meta.env.VITE_ENDPOINT_BASE_URL;
const API_URL_SUFFIX = import.meta.env.VITE_API_URL_SUFFIX;

export const fetchUserMedicinesGet = async (userId: string) => {
    const url: string = `${BASE_URL}${API_URL_SUFFIX}UserMedicine?googleUserId=${userId}`;

    const response = await fetch(url, {
        method: 'GET',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch user medicine');
    }

    return response;
}

export const fetchUserMedicinesPost = async (name: string, abbreviation: string, type: string, userId: string) => {
    const url = `${BASE_URL}${API_URL_SUFFIX}UserMedicine?name=${encodeURIComponent(name)}&abbreviation=${encodeURIComponent(abbreviation.toLowerCase())}&type=${encodeURIComponent(type)}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ googleUserId: userId }),
    });

    return response;
};

export const fetchUserMedicinesDelete = async (name: string, abbreviation: string, userId: string) => {
    const url: string = `${BASE_URL}${API_URL_SUFFIX}UserMedicine?name=${name}&abbreviation=${abbreviation}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ googleUserId: userId }),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch user medicine');
    }

    return response;
}
