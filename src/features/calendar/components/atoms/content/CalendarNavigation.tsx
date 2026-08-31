import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function CalendarNavigation() {
	const { month, year, prevMonth, nextMonth } = useCalendar();

	return (
		<div data-testid='calendar-navigation' className='mb-4 flex items-center justify-between'>
			<button onClick={prevMonth} aria-label='Previous month' className='icon-btn'>
				<ChevronLeftIcon />
			</button>

			<h2 className='text-sm font-medium capitalize tracking-wide text-white/90'>
				{month} {year}
			</h2>

			<button onClick={nextMonth} aria-label='Next month' className='icon-btn'>
				<ChevronRightIcon />
			</button>
		</div>
	);
}

export default CalendarNavigation;
