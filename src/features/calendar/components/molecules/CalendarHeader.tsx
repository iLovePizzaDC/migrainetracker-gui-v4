import CalendarNavigation from "../atoms/CalendarNavigation";
import Weekdays from "../atoms/Weekdays";

function CalendarHeader() {

    return (
        <div>
            <CalendarNavigation />
            <Weekdays />
        </div>
    );
}

export default CalendarHeader;
