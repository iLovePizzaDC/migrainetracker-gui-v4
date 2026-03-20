import { fetchUserInformation, fetchUserLogin, fetchUserLogout } from '@/shared/api/user.api';
import type { User } from '@/shared/types/user/user';
import { useEffect, useState } from 'react';

const REDIRECT_URL_SUFFIX = import.meta.env.VITE_GOOGLE_REDIRECT_URL_SUFFIX;

export function useAuthCheck(
	user: User | null,
	setUser: (user: User) => void,
	allowAnonymous = false,
) {
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const checkAuthentication = async () => {
			const code = new URLSearchParams(window.location.search).get('code');

			if (code) {
				try {
					const response = await fetchUserLogin(code);
					setUser(response.user);

					window.history.replaceState({}, '', `/${REDIRECT_URL_SUFFIX}`);
				} catch (error) {
					console.error('Login failed:', error);
				} finally {
					setAuthChecked(true);
				}
			} else {
				setAuthChecked(true);
			}
		};

		checkAuthentication();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (authChecked && !user) {
			fetchUserInformation()
				.then(setUser)
				.catch(() => {
					if (!allowAnonymous) fetchUserLogout();
				});
		}
	}, [authChecked, user, setUser, allowAnonymous]);
}
