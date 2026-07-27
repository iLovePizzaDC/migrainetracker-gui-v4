import { CalendarContext } from '@/features/calendar/context/calendar-context';
import { useContext } from 'react';

export const useCalendar = () => {
	const context = useContext(CalendarContext);
	if (!context) throw new Error('useCalendar must be used within a CalendarProvider');
	return context;
};
