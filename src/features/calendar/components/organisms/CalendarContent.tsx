import { useCalendar } from "../../hooks/use-calendar";

interface ICalendarContent {
    onDayClick: (day: number) => void;
}

function CalendarContent({ onDayClick }: ICalendarContent) {
    const { isLoading, daysArray, events } = useCalendar();

    const getEventForDay = (day: number | null) => {
        if (!day) return null;
        return events.find(event => event.date.getDate() === day);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-7 text-center gap-1">
                {isLoading ? (
                    Array.from({ length: 35 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-10 flex flex-col items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm animate-pulse"
                        >
                            <div className="w-4 h-4 rounded-full bg-white/20 mt-1" />
                        </div>
                    ))
                ) : daysArray.map((day, index) => {
                    const event = getEventForDay(day);

                    return (
                        <div
                            key={index}
                            onClick={() => day && onDayClick(day)}
                            className={`
                                h-10 flex flex-col items-center justify-center
                                rounded-lg transition
                                ${day ? "hover:bg-white/10 cursor-pointer" : "opacity-0"}
                            `}
                        >
                            {day ?? ""}
                            <div
                                className={`w-2 h-2 rounded-full mt-1 ${
                                    event ? event.strength : "bg-transparent"
                                }`}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CalendarContent;
