import { useEffect } from "react";
import { useUser } from "../../../shared/hooks/user/use-user";
import { fetchUserLogin } from "../../../shared/api/user.api";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const REDIRECT_URL_SUFFIX = import.meta.env.VITE_GOOGLE_REDIRECT_URL_SUFFIX;

function OverviewPage() {
  const { setUser } = useUser();

  useEffect(() => {
    const authenticate = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        const data = await fetchUserLogin(code);
        setUser(data.user);
        window.history.replaceState({}, document.title, `${BASE_URL}${REDIRECT_URL_SUFFIX}`);
      }
    }

    authenticate();
  }, []);

  return (
    <>
      overview page
    </>
  )
}

export default OverviewPage;
