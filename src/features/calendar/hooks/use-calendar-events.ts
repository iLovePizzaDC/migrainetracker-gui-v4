import type { CalendarFilter } from "@/features/calendar/types/calendar";
import type { Event, EventDescription } from "@/features/calendar/types/event";
import { calculateMigrenosusFlags, determineStrength } from "@/features/calendar/utils/event-highlight";
import { parseEventDescription } from "@/features/calendar/utils/event-parser";
import { filterEvents } from "@/features/calendar/utils/filter";
import { fetchMigraineEvents } from "@/shared/api/migraine.api";
import type { RawEventResponse } from "@/shared/api/types/migraine";
import { formatDateToUs } from "@/shared/utils/date/date";
import { useEffect, useRef, useState } from "react";

export function useCalendarEvents(
    firstDayOfMonth: Date,
    lastDayOfMonth: Date,
    daysInMonth: number,
) {
    const [rawEvents, setRawEvents] = useState<Event[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [migrenosusFlags, setMigrenosusFlags] = useState<boolean[]>([]);
    const [filter, setFilter] = useState<CalendarFilter>({ intensity: null, symptom: [], medicine: [], midas: [] });
    const [isLoading, setIsLoading] = useState(true);

    const fetchIdRef = useRef(0);

    useEffect(() => {
        const fetchId = ++fetchIdRef.current;
        const abortController = new AbortController();

        const loadEvents = async () => {
            try {
                setIsLoading(true);

                const raw = await fetchMigraineEvents(
                    formatDateToUs(firstDayOfMonth),
                    formatDateToUs(lastDayOfMonth),
                    undefined,
                    abortController.signal
                );

                if (fetchId !== fetchIdRef.current || !raw) return;

                const parsedEvents: Event[] = raw
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

                setRawEvents(parsedEvents);
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }
                console.error("Failed to load events:", error);
            }
            setIsLoading(false);
        };

        loadEvents();

        return () => {
            abortController.abort();
        };
    }, [firstDayOfMonth, lastDayOfMonth]);

    useEffect(() => {
        const runFilter = () => {
            const filtered = rawEvents.filter(event => filterEvents(event, filter));
            setEvents(filtered);
            setMigrenosusFlags(calculateMigrenosusFlags(filtered, daysInMonth, 4));
        };

        runFilter();
    }, [rawEvents, filter, daysInMonth]);

    const refetchEvents = async () => {
        const abortController = new AbortController();
        try {
            setIsLoading(true);

            const raw = await fetchMigraineEvents(
                formatDateToUs(firstDayOfMonth),
                formatDateToUs(lastDayOfMonth),
                undefined,
                abortController.signal
            );

            if (!raw) return;

            const parsedEvents: Event[] = raw
                .map((event: RawEventResponse) => {
                    const description = parseEventDescription(event);
                    if (!description) return null;

                    return {
                        date: new Date(event.start.date),
                        description,
                        strength: determineStrength(description),
                    } satisfies Event;
                })
                .filter((event: Event | null): event is Event => event !== null)
                .sort((a: Event, b: Event) => a.date.getTime() - b.date.getTime());

            const filteredEvents = parsedEvents.filter(parsedEvent => filterEvents(parsedEvent, filter));
            setEvents(filteredEvents);
            const migrenosusFlags = calculateMigrenosusFlags(parsedEvents, daysInMonth, 3);
            setMigrenosusFlags(migrenosusFlags);
        } catch (err) {
            if (!(err instanceof DOMException && err.name === "AbortError")) {
                console.error("Failed to refetch events:", err);
            }
        }
        setIsLoading(false);
    };

    return {
        events, migrenosusFlags, filter,
        setFilter, isLoading, refetchEvents,
    };
}
