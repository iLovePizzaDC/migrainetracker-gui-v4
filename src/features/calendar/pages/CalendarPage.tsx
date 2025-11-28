import { useAuthCheck } from "../../../shared/auth/use-auth-check";
import { useUser } from "../../../shared/hooks/user/use-user";
import Calendar from "../components/organisms/Calendar";

function CalendarPage() {
  const { user, setUser } = useUser();
  useAuthCheck(user, setUser);

  return (
    <div>
      <Calendar />
    </div>
  );
}

export default CalendarPage;
