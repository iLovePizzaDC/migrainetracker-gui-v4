import { fetchOAuthAccessToken } from '@/shared/api/google.api';

function LoginButton() {
  const redirectToLogin = () => {
    window.location.href = fetchOAuthAccessToken();
  };

  return (
    <button
      onClick={redirectToLogin}
      className='
                fixed right-0 bottom-0 m-7 p-4 z-30
                rounded-xl border border-white/30
                hover:opacity-80 transition-opacity
                bg-white/10 backdrop-blur-md
                shadow-lg shadow-black/20
            '
    >
      Login
    </button>
  );
}

export default LoginButton;
