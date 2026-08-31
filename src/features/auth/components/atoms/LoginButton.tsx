import { fetchOAuthAccessToken } from '@/shared/api/google.api';

function LoginButton() {
	const redirectToLogin = () => {
		window.location.href = fetchOAuthAccessToken();
	};

	return (
		<button onClick={redirectToLogin} className='btn-primary w-full sm:w-auto'>
			Sign in with Google
		</button>
	);
}

export default LoginButton;
