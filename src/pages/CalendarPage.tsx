import Calendar from '@/features/calendar/components/organisms/Calendar';
import { CalendarProvider } from '@/features/calendar/hooks/calendar-provider';

function CalendarPage() {
	return (
		<div className='w-full'>
			<header className='mb-6 text-left sm:mb-8'>
				<h1 className='page-heading'>Calendar</h1>
				<p className='page-subheading'>Log and review your migraine days.</p>
			</header>
			<CalendarProvider>
				<Calendar />
			</CalendarProvider>
		</div>
	);
}

export default CalendarPage;
