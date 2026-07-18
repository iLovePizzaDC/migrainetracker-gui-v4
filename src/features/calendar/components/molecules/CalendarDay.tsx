import Dot from '@/features/calendar/components/atoms/Dot';
import { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { getEventForDay } from '@/features/calendar/utils/event-highlight';

interface ICalendarDay {
	day: number | null;
	index: number;
	openDate: Date | null;
	onDayClick: (day: number) => void;
}

function CalendarDay({ day, index, openDate, onDayClick }: ICalendarDay) {
	const { date, calendarEvents, filteredEvents, migrainosusFlags, prophylaxisEvents } =
		useCalendar();

	const today = new Date();
	const isInSelectedMonth =
		(openDate &&
			date.getMonth() === openDate.getMonth() &&
			date.getFullYear() === openDate.getFullYear()) ||
		(date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear());

	const migraineEvent = getEventForDay(day, calendarEvents);
	const prophylaxisEvent = getEventForDay(day, prophylaxisEvents);
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
			<div className='flex gap-x-1'>
				<Dot
					testId={`color-indicator-${day}`}
					color={migraineEvent ? STRENGTH_MAP[migraineEvent.strength] : 'bg-transparent'}
					ring={!!(day && migrainosusFlags[day - 1])}
				/>
				{prophylaxisEvent && <Dot testId={`prophylaxis-indicator-${day}`} color='bg-cyan-400' />}
			</div>
		</div>
	);
}

export default CalendarDay;
