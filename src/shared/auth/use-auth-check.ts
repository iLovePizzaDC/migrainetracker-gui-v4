import { fetchUserInformation, fetchUserLogin } from '@/shared/api/user.api';
import type { User } from '@/shared/types/user/user';
import { useEffect, useState } from 'react';

export function useAuthCheck(setUser: (user: User | null) => void) {
	const [authChecked, setAuthChecked] = useState(false);

	useEffect(() => {
		const init = async () => {
			const code = new URLSearchParams(window.location.search).get('code');

			try {
				if (code) {
					const response = await fetchUserLogin(code);
					setUser(response.user);

					const url = new URL(window.location.href);
					url.search = '';
					window.history.replaceState({}, '', url.toString());
				} else {
					const me = await fetchUserInformation();
					setUser(me.user);
				}
			} catch {
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
