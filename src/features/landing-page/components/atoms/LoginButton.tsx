import { fetchOAuthAccessToken } from "../../../../shared/api/google.api";

export default function LoginButton() {
    const redirectToLogin = () => {
        window.location.href = fetchOAuthAccessToken();
    };

    return(
        <button onClick={redirectToLogin} className='fixed border border-white p-4 m-7 right-0 bottom-0 rounded-xl z-30'>Login</button>
    );
}
