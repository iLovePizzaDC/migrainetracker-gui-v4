import { useState } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const month = currentDate.toLocaleString("de-DE", { month: "long" });
    const year = currentDate.getFullYear();

    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(year, currentDate.getMonth() + 1, 0);

    const firstWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const daysArray = [];
    for (let i = 0; i < firstWeekday; i++) {
        daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    function prevMonth() {
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    }

    function nextMonth() {
        setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    }

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
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    className="p-2 rounded-xl hover:bg-white/10 transition"
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>

                <h2 className="text-lg font-semibold capitalize">
                    {month} {year}
                </h2>

                <button
                    onClick={nextMonth}
                    className="p-2 rounded-xl hover:bg-white/10 transition"
                >
                    <ChevronRightIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="grid grid-cols-7 text-center mb-2 text-sm font-semibold opacity-80">
                <div>Sun.</div>
                <div>Mon.</div>
                <div>Tue.</div>
                <div>Wed.</div>
                <div>Thu.</div>
                <div>Fri.</div>
                <div>Sat.</div>
            </div>

            <div className="grid grid-cols-7 text-center gap-1">
                {daysArray.map((day, i) => (
                    <div
                        key={i}
                        className={`
                            h-10 flex items-center justify-center rounded-lg
                            ${day ? "hover:bg-white/10 cursor-pointer" : "opacity-0"}
                            transition
                        `}
                    >
                        {day ?? ""}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
