import CalendarDay from '@/features/calendar/components/molecules/CalendarDay';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';

interface ICalendarContent {
	openDate: Date | null;
	onDayClick: (day: number) => void;
}

function CalendarContent({ openDate, onDayClick }: ICalendarContent) {
	const { isLoading, daysArray } = useCalendar();

	return (
		<div data-testid='calendar-content' className='space-y-4'>
			<div className='grid grid-cols-7 text-center gap-1'>
				{isLoading
					? Array.from({ length: 35 }).map((_, index) => (
							<div
								key={index}
								data-testid='day-skeleton'
								className='h-14 flex flex-col items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm animate-pulse'
							>
								<div className='w-4 h-4 rounded-full bg-white/20 mt-1' />
							</div>
						))
					: daysArray.map((day, index) => (
							<CalendarDay day={day} index={index} openDate={openDate} onDayClick={onDayClick} />
						))}
			</div>
		</div>
	);
}

export default CalendarContent;
