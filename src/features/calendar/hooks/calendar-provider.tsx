import { CalendarContext } from "@/features/calendar/context/calendar-context";
import { useCalendarDate } from "@/features/calendar/hooks/use-calendar-date";
import { useCalendarEvents } from "@/features/calendar/hooks/use-calendar-events";
import { useMedDays } from "@/features/calendar/hooks/use-med-days";
import { useUserMedicines } from "@/shared/hooks/user/use-user-medicines";
import { type ReactNode } from "react";

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
    const {
        currentDate, firstDayOfMonth, lastDayOfMonth,
        daysArray, daysInMonth, month, year,
        setMonth, prevMonth, nextMonth,
    } = useCalendarDate();

    const {
        events, migrenosusFlags, filter,
        setFilter, isLoading, refetchEvents,
    } = useCalendarEvents(firstDayOfMonth, lastDayOfMonth, daysInMonth);

    const {
        medDaysCount, maxMedDaysCount,
    } = useMedDays(currentDate, refetchEvents);

    const { userMedicineOptions } = useUserMedicines()

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
                medDaysCount,
                maxMedDaysCount,
                migrenosusFlags,
                userMedicineOptions,
                filter,
                setFilter,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};
