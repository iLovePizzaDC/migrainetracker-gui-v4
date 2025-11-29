import { createContext } from 'react';
import type { Event } from '../../../shared/types';

interface ICalendarContext {
    daysArray: (number | null)[];
    month: string;
    year: number;
    prevMonth: () => void;
    nextMonth: () => void;
    events: Event[];
}

export const CalendarContext = createContext<ICalendarContext>({
    daysArray: [],
    month: new Date().toLocaleString("de-DE", { month: "long" }),
    year: new Date().getFullYear(),
    prevMonth: () => {},
    nextMonth: () => {},
    events: [],
});
