import { createContext } from 'react';
import type { Event } from '../../../shared/types';

interface ICalendarContext {
    date: Date;
    daysArray: (number | null)[];
    month: string;
    year: number;
    setMonth: (date: Date) => void;
    prevMonth: () => void;
    nextMonth: () => void;
    events: Event[];
}

export const CalendarContext = createContext<ICalendarContext>({
    date: new Date(),
    daysArray: [],
    month: new Date().toLocaleString("de-DE", { month: "long" }),
    year: new Date().getFullYear(),
    setMonth: () => {},
    prevMonth: () => {},
    nextMonth: () => {},
    events: [],
});
