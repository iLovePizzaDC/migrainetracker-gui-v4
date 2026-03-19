import type { Event } from '@/features/calendar/types/event';
import type { EventFilter } from '@/shared/types/event/event';
import type { DropdownOption } from '@/shared/types/input/input';
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
	loadUserMedicines: () => Promise<void>;
	calendarEvents: Event[];
	filteredEvents: Event[];
	medDaysCount: number;
	maxMedDaysCount: number;
	migrainosusFlags: boolean[];
	userMedicineOptions: DropdownOption[];
	filter: EventFilter;
	setFilter: React.Dispatch<React.SetStateAction<EventFilter>>;
}

export const CalendarContext = createContext<ICalendarContext | null>(null);
