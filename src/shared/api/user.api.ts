import type { User } from "../types";
import { getDomainWithTld } from "../utils/redirect/redirect-helper";

const ENDPOINT_BASE_URL = import.meta.env.VITE_ENDPOINT_BASE_URL;
const API_URL_SUFFIX = import.meta.env.VITE_API_URL_SUFFIX;

export const fetchUserLogin = async (code: string) => {
    const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}auth/google`;

    const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user informations');
    }

    return await response.json();
}

export const fetchUserLogout = async () => {
    try {
        const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}logout`;

        await fetch(url, {
            method: "POST",
            credentials: "include",
        });
    } catch {
        throw new Error('Failed to logout user');
    } finally {
        localStorage.clear();
        sessionStorage.clear();

        window.location.href = getDomainWithTld();
    }
}

export const fetchUserInformation = async () => {
    const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}auth/me`;

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user informations');
    }

    return response;
}

export const fetchNewUser = async (user: User) => {
    const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}User?email=${user.email}&lastName=${user.family_name}&firstName=${user.name}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ googleUserId: user.id }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch migraine amount data');
    }

    return response;
}

export const fetchUserPremiumGet = async (userId: string) => {
    const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}PremiumUser?googleUserId=${userId}`;

    const response = await fetch(url, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user medicine');
    }

    return response;
}

export const fetchUserPremiumPost = async (userId: string) => {
    const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}PremiumUser`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ googleUserId: userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user medicine');
    }

    return response;
}

export const fetchOrder = async (planId: number, subscriptionId: string, userId: string) => {
    const url: string = `${ENDPOINT_BASE_URL}${API_URL_SUFFIX}Order?planId=${planId}&subscriptionId=${subscriptionId}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ googleUserId: userId }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch order');
    }

    return response;
}
