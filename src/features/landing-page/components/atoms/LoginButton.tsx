import { fetchOAuthAccessToken } from "../../../../shared/api/google.api";

function LoginButton() {
    const redirectToLogin = () => {
        const autoLogin = !!document.cookie.match(/MT_session=/);
        window.location.href = fetchOAuthAccessToken(autoLogin);
    };

    return(
        <button onClick={redirectToLogin} className='fixed border border-white p-4 m-7 right-0 bottom-0 rounded-xl z-30'>Login</button>
    );
}

export default LoginButton;
