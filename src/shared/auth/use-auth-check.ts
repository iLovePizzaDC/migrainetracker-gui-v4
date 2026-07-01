import { fetchUserInformation, fetchUserLogin } from '@/shared/api/user.api';
import type { User } from '@/shared/types/user/user';
import { useEffect, useState } from 'react';
import { GOOGLE_TOKEN_EXPIRED } from '../constants/api/exceptions';

export function useAuthCheck(setUser: (user: User | null) => void) {
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const init = async () => {
			const code = new URLSearchParams(window.location.search).get('code');

			try {
				if (code) {
					const response = await fetchUserLogin(code);
					sessionStorage.removeItem(GOOGLE_TOKEN_EXPIRED);

					setUser(response.user);

					const url = new URL(window.location.href);
					url.search = '';
					window.history.replaceState({}, '', url.toString());
				} else {
					if (sessionStorage.getItem(GOOGLE_TOKEN_EXPIRED)) {
						setUser(null);
						return;
					}

					try {
						const me = await fetchUserInformation();
						setUser(me.user);
					} catch {
						setUser(null);
					}
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				setUser(null);
			} finally {
				setAuthChecked(true);
			}
		};

		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { authChecked };
}
