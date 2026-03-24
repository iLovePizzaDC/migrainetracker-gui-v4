import Calendar from '@/features/calendar/components/organisms/Calendar';
import { CalendarProvider } from '@/features/calendar/hooks/calendar-provider';

function CalendarPage() {
	return (
		<div className='w-full'>
			<div className='max-w-6xl mx-auto'>
				<CalendarProvider>
					<Calendar />
				</CalendarProvider>
			</div>
		</div>
	);
}

export default CalendarPage;
