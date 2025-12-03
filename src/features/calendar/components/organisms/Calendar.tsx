import CalendarContent from "./CalendarContent";
import CalendarHeader from "../molecules/CalendarHeader";
import MigrainePanel from "./MigrainePanel";
import { useState } from "react";
import { useCalendar } from "../../hooks/use-calendar";
import { createEntry } from "../../../../shared/utils/formatter/event-parser";
import type { Entry } from "../../../../shared/types";
import { normalizeDate } from "../../../../shared/utils/date/date";
import type { StoredEntry } from "../../../../shared/types/calendar/calendar";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

function Calendar() {
    const { isLoading, date, events, setMonth } = useCalendar();

    const [openDay, setOpenDay] = useState<number | null>(null);
    const [entry, setEntry] = useState<Entry | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isStoredEntryDisplaying, setIsStoredEntryDisplaying] = useState(false);

    const onDayClick = (day: number) => {
        const selected = new Date(date);
        selected.setDate(day);

        const foundEvent = events.find(
            (event) => {
                return normalizeDate(event.date).getTime() === normalizeDate(selected).getTime()
            }
        );
        const entry = foundEvent ? createEntry(foundEvent) : null;

        setIsStoredEntryDisplaying(false);
        setEntry(entry);
        setSelectedDate(selected);
        setOpenDay(day);
    };

    const onLoadEntryClick = () => {
        const rawStoredEntry = localStorage.getItem('MT_NE');

        if (rawStoredEntry) {
            const entry: StoredEntry = JSON.parse(rawStoredEntry);
            const entryDate: Date = normalizeDate(new Date(entry.date));

            setIsStoredEntryDisplaying(true);
            setMonth(entryDate);
            setEntry(entry);
            setSelectedDate(entryDate);
            setOpenDay(entryDate.getDay());
        }
    };

    return (
        <>
            <div className="relative rounded-2xl p-6 bg-transparent backdrop-blur-xl border border-white/20 shadow-lg shadow-black/30 w-full max-w-md min-h-96 mx-auto flex flex-col">
                <div className="flex-1 flex flex-col">
                    <CalendarHeader />
                    <CalendarContent onDayClick={onDayClick} />
                </div>

                <div className="mt-2 flex justify-end">
                    <button
                        onClick={onLoadEntryClick}
                        className="flex items-center justify-center disabled:opacity-80 transition-opacity"
                        disabled={isLoading}
                    >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
            {openDay && (
                <MigrainePanel
                    key={openDay}
                    date={selectedDate ?? date}
                    onClose={() => {
                        setOpenDay(null);
                        setSelectedDate(null);
                        setEntry(null);
                    }}
                    prefilled={entry}
                    disabled={!!entry && !isStoredEntryDisplaying}
                />
            )}
        </>
    );
}

export default Calendar;
