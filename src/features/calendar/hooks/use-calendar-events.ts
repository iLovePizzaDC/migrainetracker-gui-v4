import { MIGRAINOSUS_FLAG_THRESHOLD } from "@/features/calendar/constants/calendar";
import type { Event, EventDescription } from "@/features/calendar/types/event";
import { calculateMigrenosusFlags, determineStrength } from "@/features/calendar/utils/event-highlight";
import { parseEventDescription } from "@/features/calendar/utils/event-parser";
import { filterEvents } from "@/features/calendar/utils/filter";
import { fetchMigraineEvents } from "@/shared/api/migraine.api";
import type { RawEventResponse } from "@/shared/api/types/migraine";
import type { EventFilter } from "@/shared/types/event/event";
import { formatDateToUs, getDateAfterDays, getDateBeforeDays } from "@/shared/utils/date/date";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";


export function useCalendarEvents(
    firstDayOfMonth: Date,
    lastDayOfMonth: Date,
    daysInMonth: number,
) {
    const [rawEvents, setRawEvents] = useState<Event[]>([]);
    const [migrainosusFlags, setMigrenosusFlags] = useState<boolean[]>([]);
    const [filter, setFilter] = useState<EventFilter>({ intensity: null, symptom: [], medicine: [], midas: [] });
    const [isLoading, setIsLoading] = useState(true);

    const fetchIdRef = useRef(0);

    const calendarEvents = useMemo(() => {
        const start = new Date(firstDayOfMonth);
        start.setHours(0, 0, 0, 0);

        const end = new Date(lastDayOfMonth);
        end.setHours(23, 59, 59, 999);

        return rawEvents.filter(
            event => event.date >= start && event.date <= end
        );
    }, [rawEvents, firstDayOfMonth, lastDayOfMonth]);

    const filteredEvents = useMemo(() => {
        return calendarEvents.filter(e => filterEvents(e, filter));
    }, [calendarEvents, filter]);

    const loadEvents = useCallback(async (abortController?: AbortController) => {
        const id = ++fetchIdRef.current;
        setIsLoading(true);

        try {
            const fetchStart = getDateBeforeDays(firstDayOfMonth, MIGRAINOSUS_FLAG_THRESHOLD);
            const fetchEnd = getDateAfterDays(lastDayOfMonth, MIGRAINOSUS_FLAG_THRESHOLD);

            const raw = await fetchMigraineEvents(
                formatDateToUs(fetchStart),
                formatDateToUs(fetchEnd),
                undefined,
                abortController?.signal
            );

            if (!raw || id !== fetchIdRef.current) return;

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
                .filter((e): e is Event => e !== null)
                .sort((a, b) => a.date.getTime() - b.date.getTime());

            setRawEvents(parsedEvents);
        } catch (err) {
            if (!(err instanceof DOMException && err.name === "AbortError")) {
                console.error("Failed to load events:", err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [firstDayOfMonth, lastDayOfMonth]);

    useEffect(() => {
        const abortController = new AbortController();
        loadEvents(abortController);

        return () => abortController.abort();
    }, [loadEvents]);

    useEffect(() => {
        const start = new Date(firstDayOfMonth);
        start.setHours(0, 0, 0, 0);

        const end = new Date(lastDayOfMonth);
        end.setHours(23, 59, 59, 999);

        setMigrenosusFlags(
            calculateMigrenosusFlags(
                rawEvents,
                firstDayOfMonth,
                daysInMonth,
                MIGRAINOSUS_FLAG_THRESHOLD
            )
        );
    }, [rawEvents, filter, daysInMonth, firstDayOfMonth, lastDayOfMonth]);

    const refetchEvents = () => loadEvents(new AbortController());

    return {
        calendarEvents,
        filteredEvents,
        migrainosusFlags,
        filter,
        setFilter,
        isLoading,
        refetchEvents
    };
}
