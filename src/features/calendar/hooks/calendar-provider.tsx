import { useEffect, useState, useMemo, type ReactNode, useRef } from "react";
import { CalendarContext } from "../context/calendar-context";
import type { DropdownOption, Event, EventDescription, RawEventResponse } from "../../../shared/types";
import { fetchMigraineEvents } from "../../../shared/api/migraine.api";
import { formatDateToUs } from "../../../shared/utils/date/date";
import { parseEventDescription } from "../../../shared/utils/formatter/event-parser";
import { calculateMigrenosusFlags, determineStrength } from "../utils/event-highlight";
import { fetchUserMedicinesGet } from "../../../shared/api/medicine.api";
import { useUser } from "../../../shared/hooks/user/use-user";
import type { Medicine } from "../../../shared/types/user/medicine";

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [migrenosusFlags, setMigrenosusFlags] = useState<boolean[]>([]);
    const [userMedicineOptions, setUserMedicineOptions] = useState<DropdownOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        setCurrentDate((current) => {
            if (
                current.getMonth() === date.getMonth() &&
                current.getFullYear() === date.getFullYear()
            ) {
                return current;
            }

            return new Date(date.getFullYear(), date.getMonth(), 1);
        });
    };

    const prevMonth = () => {
        setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));
        setEvents([]);
    };

    const nextMonth = () => {
        setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));
        setEvents([]);
    };

    // TODO refactor
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

            const parsed = raw
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

                setEvents(parsed);
                const migrenosusFlags = calculateMigrenosusFlags(parsed, daysInMonth, 3);
                setMigrenosusFlags(migrenosusFlags);
        } catch (err) {
            if (!(err instanceof DOMException && err.name === "AbortError")) {
                console.error("Failed to refetch events:", err);
            }
        }
        setIsLoading(false);
    };

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
                const migrenosusFlags = calculateMigrenosusFlags(parsed, daysInMonth, 3);
                setMigrenosusFlags(migrenosusFlags);
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
        const load = async () => {
            if (!user) return;
            const meds: Medicine[] = await fetchUserMedicinesGet(user.id);
            setUserMedicineOptions(
                meds.map(m => ({
                    label: m.name,
                    value: m.abbreviation
                }))
            );
        };

        load();
    }, [user]);

    return (
        <CalendarContext.Provider
            value={{
                isLoading,
                date: currentDate,
                daysArray,
                month,
                year,
                setMonth,
                prevMonth,
                nextMonth,
                refetchEvents,
                events,
                migrenosusFlags,
                userMedicineOptions,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};
