import Calendar from "@/features/calendar/components/organisms/Calendar";
import { CalendarProvider } from "@/features/calendar/hooks/calendar-provider";
import { useAuthCheck } from "@/shared/auth/use-auth-check";
import { useUser } from "@/shared/hooks/user/use-user";

function CalendarPage() {
  const { user, setUser } = useUser();
  useAuthCheck(user, setUser);

  return (
    <div className="w-full">
        <div className="max-w-6xl mx-auto">
          <CalendarProvider>
            <Calendar />
          </CalendarProvider>
        </div>
    </div>
  );
}

export default CalendarPage;
