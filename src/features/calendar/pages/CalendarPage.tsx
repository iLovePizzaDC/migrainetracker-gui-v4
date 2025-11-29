import { useAuthCheck } from "../../../shared/auth/use-auth-check";
import { useUser } from "../../../shared/hooks/user/use-user";
import Calendar from "../components/organisms/Calendar";
import { CalendarProvider } from "../hooks/calendar-provider";

function CalendarPage() {
  const { user, setUser } = useUser();
  useAuthCheck(user, setUser);

  return (
    <CalendarProvider>
      <Calendar />
    </CalendarProvider>
  );
}

export default CalendarPage;
