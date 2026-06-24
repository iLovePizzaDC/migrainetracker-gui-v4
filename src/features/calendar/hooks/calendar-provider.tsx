import { CalendarContext } from '@/features/calendar/context/calendar-context';
import { useCalendarDate } from '@/features/calendar/hooks/use-calendar-date';
import { useCalendarEvents } from '@/features/calendar/hooks/use-calendar-events';
import { useMedDays } from '@/features/calendar/hooks/use-med-days';
import { useCallback, useEffect, type ReactNode } from 'react';

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
		filter,
		setFilter,
		isLoading,
		refetchEvents: _refetchEvents,
	} = useCalendarEvents(firstDayOfMonth, lastDayOfMonth, daysInMonth);

	const { medDaysCount, maxMedDaysCount, collectMedDays } = useMedDays(currentDate);

	const refetchEvents = useCallback(async () => {
		await _refetchEvents();
		await collectMedDays();
	}, [_refetchEvents, collectMedDays]);

	useEffect(() => {
		collectMedDays();
	}, [collectMedDays, refetchEvents]);

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
				collectMedDays,
				calendarEvents,
				filteredEvents,
				medDaysCount,
				maxMedDaysCount,
				migrainosusFlags,
				filter,
				setFilter,
			}}
		>
			{children}
		</CalendarContext.Provider>
	);
};
