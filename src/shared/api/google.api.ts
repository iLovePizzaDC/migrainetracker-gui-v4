const BASE_URL = import.meta.env.VITE_BASE_URL;
const REDIRECT_URL_SUFFIX = import.meta.env.VITE_GOOGLE_REDIRECT_URL_SUFFIX;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const fetchOAuthAccessToken = (autoLogin = false): string => {
	const prompt = autoLogin ? 'none' : 'select_account';
	const scope =
		'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

	return (
		`https://accounts.google.com/o/oauth2/v2/auth` +
		`?client_id=${GOOGLE_CLIENT_ID}` +
		`&redirect_uri=${BASE_URL}${REDIRECT_URL_SUFFIX}` +
		`&response_type=code` +
		`&scope=${scope}` +
		`&include_granted_scopes=true` +
		`&prompt=${prompt}`
	);
};
