import type { Event } from '@/features/calendar/types/event';
import type { EventFilter } from '@/shared/types/event/event';
import { createContext } from 'react';

export interface ICalendarContext {
	isLoading: boolean;
	date: Date;
	daysArray: (number | null)[];
	month: string;
	year: number;
	setMonth: (date: Date) => void;
	prevMonth: () => void;
	nextMonth: () => void;
	refetchEvents: () => Promise<void>;
	collectMedDays: () => Promise<void>;
	calendarEvents: Event[];
	filteredEvents: Event[];
	medDaysCount: number;
	maxMedDaysCount: number;
	migrainosusFlags: boolean[];
	filter: EventFilter;
	setFilter: React.Dispatch<React.SetStateAction<EventFilter>>;
}

export const CalendarContext = createContext<ICalendarContext | null>(null);
