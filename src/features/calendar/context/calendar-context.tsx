import { createContext } from 'react';
import type { DropdownOption, Event } from '../../../shared/types';

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
    userMedicineOptions: DropdownOption[];
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
    userMedicineOptions: []
});
