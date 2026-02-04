import { useCalendar } from "@/features/calendar/hooks/use-calendar";

interface ICalendarContent {
    openDate: Date | null;
    onDayClick: (day: number) => void;
}

function CalendarContent({ openDate, onDayClick }: ICalendarContent) {
    const { isLoading, date, daysArray, filteredEvents, migrainosusFlags } = useCalendar();

    const getEventForDay = (day: number | null) => {
        if (!day) return null;
        return filteredEvents.find(event => event.date.getDate() === day);
    };

    const today = new Date();
    const isInSelectedMonth = (openDate && date.getMonth() === openDate.getMonth() && date.getFullYear() === openDate.getFullYear() ||
                                date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear());

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-7 text-center gap-1">
                {isLoading ? (
                    Array.from({ length: 35 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-14 flex flex-col items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm animate-pulse"
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
                                h-14 flex flex-col items-center justify-center
                                rounded-lg transition-color duration-200
                                ${day
                                    ? `${day === openDate?.getDate() && isInSelectedMonth
                                            ? 'bg-white/10'
                                            : `${day === today.getDate() && isInSelectedMonth
                                                ? 'bg-white/5 hover:bg-white/10 cursor-pointer'
                                                : 'hover:bg-white/10 cursor-pointer'
                                            }`
                                        }`
                                    : "opacity-0"
                                }
                            `}
                        >
                            {day ?? ""}
                            <div
                                className={`w-2 h-2 rounded-full mt-1
                                    ${event ? event.strength : "bg-transparent"}
                                    ${day && migrainosusFlags[day - 1] ? "ring-1 ring-red-500" : ""}
                                `}
                            />

                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default CalendarContent;
