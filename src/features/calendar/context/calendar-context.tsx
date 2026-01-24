import type { Event } from '@/features/calendar/types/event';
import type { EventFilter } from '@/shared/types/event/event';
import type { DropdownOption } from '@/shared/types/input/input';
import { createContext } from 'react';

interface ICalendarContext {
    isLoading: boolean;
    date: Date;
    daysArray: (number | null)[];
    month: string;
    year: number;
    setMonth: (date: Date) => void;
    prevMonth: () => void;
    nextMonth: () => void;
    refetchEvents: () => Promise<void>;
    events: Event[];
    medDaysCount: number;
    maxMedDaysCount: number;
    migrenosusFlags: boolean[];
    userMedicineOptions: DropdownOption[];
    filter: EventFilter;
    setFilter: React.Dispatch<React.SetStateAction<EventFilter>>;
}

export const CalendarContext = createContext<ICalendarContext>({
    isLoading: true,
    date: new Date(),
    daysArray: [],
    month: new Date().toLocaleString("de-DE", { month: "long" }),
    year: new Date().getFullYear(),
    setMonth: () => {},
    prevMonth: () => {},
    nextMonth: () => {},
    refetchEvents: async () => {},
    events: [],
    medDaysCount: 0,
    maxMedDaysCount: 10,
    migrenosusFlags: [],
    userMedicineOptions: [],
    filter: { intensity: null, symptom: [], medicine: [], midas:[] },
    setFilter: () => {},
});
