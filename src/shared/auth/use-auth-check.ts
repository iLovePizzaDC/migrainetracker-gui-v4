import { useEffect } from 'react';
import type { User } from '../types';
import { fetchUserInformation, fetchUserLogout } from '../api/user.api';

export function useAuthCheck(setUser: (user: User) => void, isPageVisibleForAnonymousUser = false) {
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetchUserInformation();

                if (!response.ok) {
                    if (!isPageVisibleForAnonymousUser) fetchUserLogout();
                    return;
                }

                const data = await response.json();
                setUser({
                    id: data.id,
                    email: data.email,
                    name: data.given_name,
                    family_name: data.family_name,
                    picture: data.picture
                });

            } catch {
                if (!isPageVisibleForAnonymousUser) fetchUserLogout();
            }
        };

        checkAuth();
    }, []);
}
