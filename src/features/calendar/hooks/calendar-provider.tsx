import { CalendarContext } from '@/features/calendar/context/calendar-context';
import { useCalendarDate } from '@/features/calendar/hooks/use-calendar-date';
import { useCalendarEvents } from '@/features/calendar/hooks/use-calendar-events';
import { useMedDays } from '@/features/calendar/hooks/use-med-days';
import { type ReactNode } from 'react';

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
	const {
		currentDate,
		firstDayOfMonth,
		lastDayOfMonth,
		daysArray,
		daysInMonth,
		month,
		year,
		setMonth,
		prevMonth,
		nextMonth,
	} = useCalendarDate();

	const {
		calendarEvents,
		filteredEvents,
		migrainosusFlags,
		prophylaxisEvents,
		filter,
		setFilter,
		isLoading,
		refetchEvents,
	} = useCalendarEvents(firstDayOfMonth, lastDayOfMonth, daysInMonth);

	const { medDaysCount, maxMedDaysCount, collectMedDays } = useMedDays(currentDate);

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
				collectMedDays,
				refetchEvents,
				calendarEvents,
				filteredEvents,
				medDaysCount,
				maxMedDaysCount,
				migrainosusFlags,
				prophylaxisEvents,
				filter,
				setFilter,
			}}
		>
			{children}
		</CalendarContext.Provider>
	);
};
