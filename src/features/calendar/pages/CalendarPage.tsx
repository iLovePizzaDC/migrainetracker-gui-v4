import { useAuthCheck } from "../../../shared/auth/use-auth-check";
import { useUser } from "../../../shared/hooks/user/use-user";

function CalendarPage() {
  const { user, setUser } = useUser();
  useAuthCheck(user, setUser);

  return <>calendar page</>;
}

export default CalendarPage;
