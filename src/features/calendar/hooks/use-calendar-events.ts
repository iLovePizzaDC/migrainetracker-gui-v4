import type { Event, EventDescription } from "@/features/calendar/types/event";
import { calculateMigrenosusFlags, determineStrength } from "@/features/calendar/utils/event-highlight";
import { parseEventDescription } from "@/features/calendar/utils/event-parser";
import { filterEvents } from "@/features/calendar/utils/filter";
import { fetchMigraineEvents } from "@/shared/api/migraine.api";
import type { RawEventResponse } from "@/shared/api/types/migraine";
import type { EventFilter } from "@/shared/types/event/event";
import { formatDateToUs } from "@/shared/utils/date/date";
import { useCallback, useEffect, useRef, useState } from "react";

const MIGRENOSUS_FLAG_THRESHOLD = 4;

export function useCalendarEvents(
    firstDayOfMonth: Date,
    lastDayOfMonth: Date,
    daysInMonth: number,
) {
    const [rawEvents, setRawEvents] = useState<Event[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [migrenosusFlags, setMigrenosusFlags] = useState<boolean[]>([]);
    const [filter, setFilter] = useState<EventFilter>({ intensity: null, symptom: [], medicine: [], midas: [] });
    const [isLoading, setIsLoading] = useState(true);

    const fetchIdRef = useRef(0);

    const loadEvents = useCallback(async (abortController?: AbortController) => {
        const id = ++fetchIdRef.current;
        setIsLoading(true);

        try {
            const raw = await fetchMigraineEvents(
                formatDateToUs(firstDayOfMonth),
                formatDateToUs(lastDayOfMonth),
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
        const filtered = rawEvents.filter(e => filterEvents(e, filter));
        setEvents(filtered);
        setMigrenosusFlags(calculateMigrenosusFlags(filtered, daysInMonth, MIGRENOSUS_FLAG_THRESHOLD));
    }, [rawEvents, filter, daysInMonth]);

    const refetchEvents = () => loadEvents(new AbortController());

    return { events, migrenosusFlags, filter, setFilter, isLoading, refetchEvents };
}
