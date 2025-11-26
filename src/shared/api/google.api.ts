const BASE_URL = import.meta.env.VITE_BASE_URL;
const REDIRECT_URL_SUFFIX = import.meta.env.VITE_GOOGLE_REDIRECT_URL_SUFFIX;

export const fetchOAuthAccessToken = (): string => {
    const clientId: string = '1007615124667-0tsheebolqutueoas9o5o20t7eh7ip8t.apps.googleusercontent.com';
    const responseType: string = 'code';
    const scope: string = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile';
    const granted_scopes: string = 'true';

    const url: string = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${BASE_URL}${REDIRECT_URL_SUFFIX}&response_type=${responseType}&scope=${scope}&include_granted_scopes=${granted_scopes}`;

    return url;
};
