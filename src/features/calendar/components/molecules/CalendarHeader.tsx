import CalendarNavigation from "@/features/calendar/components/atoms/CalendarNavigation";
import Weekdays from "@/features/calendar/components/atoms/Weekdays";

function CalendarHeader() {

    return (
        <div>
            <CalendarNavigation />
            <Weekdays />
        </div>
    );
}

export default CalendarHeader;
