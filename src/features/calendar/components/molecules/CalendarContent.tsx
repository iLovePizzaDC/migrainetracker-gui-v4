import { useCalendar } from "../../hooks/use-calendar";

function CalendarContent() {
    const { daysArray, events } = useCalendar();

    const getEventForDay = (day: number | null) => {
        if (!day) return null;
        return events.find(event =>
            event.date.getDate() === day
        );
    };

    return (
        <div className="grid grid-cols-7 text-center gap-1">
            {daysArray.map((day, index) => {
                const event = getEventForDay(day);

                return (
                    <div
                        key={index}
                        className={`
                            h-10 flex flex-col items-center justify-center rounded-lg transition
                            ${day ? "hover:bg-white/10 cursor-pointer" : "opacity-0"}
                        `}
                    >
                        {day ? day : ""}
                        {event && (
                            <div
                                className={`w-2 h-2 rounded-full mt-1 ${event.strength}`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default CalendarContent;
