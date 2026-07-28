import CalendarNavigation from '@/features/calendar/components/atoms/content/CalendarNavigation';
import Weekdays from '@/features/calendar/components/atoms/content/Weekdays';

function CalendarHeader() {
	return (
		<div data-testid='calendar-header'>
			<CalendarNavigation />
			<Weekdays />
		</div>
	);
}

export default CalendarHeader;
