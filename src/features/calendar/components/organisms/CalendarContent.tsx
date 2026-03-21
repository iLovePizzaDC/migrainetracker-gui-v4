import { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import type { Event } from '@/features/calendar/types/event';

interface ICalendarContent {
	openDate: Date | null;
	onDayClick: (day: number) => void;
}

function CalendarContent({ openDate, onDayClick }: ICalendarContent) {
	const { isLoading, date, daysArray, calendarEvents, filteredEvents, migrainosusFlags } =
		useCalendar();

	const getEventForDay = (day: number | null, events: Event[]) => {
		if (!day) return undefined;
		return events.find((event) => event.date.getDate() === day);
	};

	const today = new Date();
	const isInSelectedMonth =
		(openDate &&
			date.getMonth() === openDate.getMonth() &&
			date.getFullYear() === openDate.getFullYear()) ||
		(date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear());

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
					: daysArray.map((day, index) => {
							const event = getEventForDay(day, calendarEvents);
							const filteredEvent = getEventForDay(day, filteredEvents);

							const baseClasses = [
								'h-14',
								'flex',
								'flex-col',
								'items-center',
								'justify-center',
								'rounded-lg',
								'transition-colors',
								'duration-200',
							];

							if (day) {
								if (
									day === openDate?.getDate() &&
									date.getMonth() === openDate?.getMonth() &&
									isInSelectedMonth
								) {
									baseClasses.push('bg-white/10');
								} else if (day === today.getDate() && isInSelectedMonth) {
									baseClasses.push('bg-white/5', 'hover:bg-white/10', 'cursor-pointer');
								} else {
									baseClasses.push('hover:bg-white/10', 'cursor-pointer');
								}
							} else {
								baseClasses.push('opacity-0');
							}

							if (filteredEvent) baseClasses.push('border', 'border-white/30');

							return (
								<div
									data-testid={day ? `day-${day}` : `empty-day-${index}`}
									key={index}
									onClick={() => day && onDayClick(day)}
									className={baseClasses.join(' ')}
								>
									{day ?? ''}
									<div
										data-testid={`color-indicator-${day}`}
										className={`w-2 h-2 rounded-full mt-1
                                            ${event ? `${STRENGTH_MAP[event.strength]}` : 'bg-transparent'}
                                            ${day && migrainosusFlags[day - 1] ? 'ring-1 ring-red-500' : ''}
                                        `}
									/>
								</div>
							);
						})}
			</div>
		</div>
	);
}

export default CalendarContent;
