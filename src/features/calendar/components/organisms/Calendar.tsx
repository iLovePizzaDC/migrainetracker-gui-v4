import CalendarContent from "../molecules/CalendarContent";
import CalendarHeader from "../molecules/CalendarHeader";

function Calendar() {
    return (
        <div
            className="
                rounded-2xl p-6
                bg-transparent backdrop-blur-xl
                border border-white/20
                shadow-lg shadow-black/30
                w-full max-w-md h-96 mx-auto
            "
        >
            <CalendarHeader />
            <CalendarContent />
        </div>
    );
}

export default Calendar;
