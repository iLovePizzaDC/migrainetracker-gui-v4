import { useAuthCheck } from "../../../shared/auth/use-auth-check";
import { useUser } from "../../../shared/hooks/user/use-user";

function OverviewPage() {
  const { user, setUser } = useUser();
  useAuthCheck(user, setUser);

  return <>overview page</>;
}

export default OverviewPage;
