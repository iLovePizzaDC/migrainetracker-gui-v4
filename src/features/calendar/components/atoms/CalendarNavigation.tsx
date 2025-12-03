import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useCalendar } from "../../hooks/use-calendar";

function CalendarNavigation() {
    const { isLoading, month, year, prevMonth, nextMonth } = useCalendar();

    return (
        <div className="flex items-center justify-between mb-4">
            <button
                onClick={prevMonth}
                className={`p-2 rounded-xl hover:opacity-80 disabled:opacity-80 transition-opacity`}
                disabled={isLoading}
            >
                <ChevronLeftIcon className="h-6 w-6" />
            </button>

            <h2 className="text-lg font-semibold capitalize">
                {month} {year}
            </h2>

            <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bopacity-80 disabled:opacity-80 transition-opacity"
                disabled={isLoading}
            >
                <ChevronRightIcon className="h-6 w-6" />
            </button>
        </div>
    );
}

export default CalendarNavigation;
