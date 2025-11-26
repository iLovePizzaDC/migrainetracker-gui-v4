import { useAuthCheck } from "../../../shared/auth/use-auth-check";
import { useUser } from "../../../shared/hooks/user/use-user";
import LoginButton from "../components/atoms/LoginButton"

function LandingPage() {
  const { setUser } = useUser();
  useAuthCheck(setUser, true);

  return (
    <>
      login page
      <LoginButton />
    </>
  )
}

export default LandingPage;
