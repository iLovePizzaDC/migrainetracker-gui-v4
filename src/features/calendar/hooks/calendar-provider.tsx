import { useEffect, useState, useMemo, type ReactNode, useRef } from "react";
import { CalendarContext } from "../context/calendar-context";
import type { Event, EventDescription, RawEventResponse } from "../../../shared/types";
import { fetchMigraineEvents } from "../../../shared/api/migraine.api";
import { formatDateToUs } from "../../../shared/utils/date/date";
import { parseEventDescription } from "../../../shared/utils/formatter/event-parser";
import { determineStrength } from "../utils/event-highlight";

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);

    const fetchIdRef = useRef(0);

    const month = currentDate.toLocaleString("en-US", { month: "long" });
    const year = currentDate.getFullYear();

    const firstDayOfMonth = useMemo(
        () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        [currentDate]
    );

    const lastDayOfMonth = useMemo(
        () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
        [currentDate]
    );

    const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = lastDayOfMonth.getDate();

    const daysArray = useMemo(() => {
        const array: (number | null)[] = [];
        for (let index = 0; index < firstWeekday; index++) array.push(null);
        for (let index = 1; index <= daysInMonth; index++) array.push(index);
        return array;
    }, [firstWeekday, daysInMonth]);

    const setMonth = (date: Date) => {
        setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    };

    const prevMonth = () => {
        setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));
        setEvents([]);
    };

    const nextMonth = () => {
        setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));
        setEvents([]);
    };

    useEffect(() => {
        const fetchId = ++fetchIdRef.current;
        const abortController = new AbortController();

        const loadEvents = async () => {
            try {
                const raw = await fetchMigraineEvents(
                    formatDateToUs(firstDayOfMonth),
                    formatDateToUs(lastDayOfMonth),
                    undefined,
                    abortController.signal
                );

                if (fetchId !== fetchIdRef.current) return;

                const parsed = raw
                    .map((event: RawEventResponse) => {
                        const description: EventDescription | null = parseEventDescription(event);
                        if (!description) return null;

                        return {
                            date: new Date(event.start.date),
                            description,
                            strength: determineStrength(description),
                        } satisfies Event;
                    })
                    .filter((event: Event | null): event is Event => event !== null)
                    .sort((a: Event, b: Event) => a.date.getTime() - b.date.getTime());

                setEvents(parsed);
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }
                console.error("Failed to load events:", error);
            }
        };

        loadEvents();

        return () => {
            abortController.abort();
        };
    }, [firstDayOfMonth, lastDayOfMonth]);

    return (
        <CalendarContext.Provider
            value={{
                date: currentDate,
                daysArray,
                month,
                year,
                setMonth,
                prevMonth,
                nextMonth,
                events,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};
