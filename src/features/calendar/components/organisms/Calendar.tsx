import CalendarHeader from "@/features/calendar/components/molecules/CalendarHeader";
import FilterCard from "@/features/calendar/components/molecules/FilterCard";
import CalendarContent from "@/features/calendar/components/organisms/CalendarContent";
import MigrainePanel from "@/features/calendar/components/organisms/MigrainePanel";
import { useCalendar } from "@/features/calendar/hooks/use-calendar";
import type { Entry, StoredEntry } from "@/features/calendar/types/calendar";
import { createEntry } from "@/features/calendar/utils/event-parser";
import { normalizeDate } from "@/shared/utils/date/date";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function Calendar() {
    const { isLoading, date, calendarEvents, setMonth, userMedicineOptions } = useCalendar();

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [entry, setEntry] = useState<Entry | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isStoredEntryDisplaying, setIsStoredEntryDisplaying] = useState(false);

    const onDayClick = (day: number) => {
        const selected = new Date(date);
        selected.setDate(day);

        const foundEvent = calendarEvents.find((event) =>
            normalizeDate(event.date).getTime() === normalizeDate(selected).getTime()
        );

        const entry: Entry | null = foundEvent ? createEntry(foundEvent) : null;

        if (entry) {
            entry.medicines = entry.medicines.map((med) => {
                const { abbreviation, label } = med.medicine;

                if (abbreviation.toLowerCase() === label.toLowerCase()) {
                    const match = userMedicineOptions.find(
                        (option) => option.value.toLowerCase() === abbreviation.toLowerCase()
                    );

                    if (match) {
                        return {
                            ...med,
                            medicine: {
                                abbreviation,
                                label: match.label
                            }
                        };
                    }
                }

                return med;
            });
        }

        setIsStoredEntryDisplaying(false);
        setEntry(entry);
        setSelectedDate(selected);
        setIsPanelOpen(true);
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
            setIsPanelOpen(true);
        }
    };

    return (
        <>
            <div className="relative rounded-2xl p-6 bg-transparent backdrop-blur-xl border border-white/20 shadow-lg shadow-black/30 w-full max-w-md min-h-96 mx-auto flex flex-col">
                <div className="flex-1 flex flex-col">
                    <CalendarHeader />
                    <CalendarContent openDate={selectedDate} onDayClick={onDayClick} />
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
            <FilterCard />
            <div className="mt-4">
                <MigrainePanel
                    date={selectedDate ?? date}
                    onClose={() => {
                        setIsPanelOpen(false);
                        setSelectedDate(null);
                        setEntry(null);
                    }}
                    isOpen={!!isPanelOpen}
                    prefilled={entry}
                    disabled={!!entry && !isStoredEntryDisplaying}
                />
            </div>
        </>
    );
}

export default Calendar;
