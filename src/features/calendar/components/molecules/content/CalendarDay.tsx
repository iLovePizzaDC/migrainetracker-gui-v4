import Dot from '@/features/calendar/components/atoms/content/Dot';
import { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { getEventForDay } from '@/features/calendar/utils/event-highlight';
import { formatRecurrence } from '@/features/calendar/utils/format-recurrence';
import Tooltip from '@/features/calendar/components/atoms/Tooltip';

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

	const isViewingOpenDateMonth =
		!!openDate &&
		date.getMonth() === openDate.getMonth() &&
		date.getFullYear() === openDate.getFullYear();

	const isViewingCurrentMonth =
		date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

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
		'ease-soft',
	];

	if (day) {
		if (day === openDate?.getDate() && isViewingOpenDateMonth) {
			baseClasses.push('bg-white/10', 'ring-1', 'ring-white/20', 'cursor-pointer');
		} else if (day === today.getDate() && isViewingCurrentMonth) {
			baseClasses.push(
				'bg-white/[0.06]',
				'ring-1',
				'ring-white/10',
				'hover:bg-white/10',
				'cursor-pointer',
			);
		} else {
			baseClasses.push('hover:bg-white/[0.08]', 'cursor-pointer');
		}
	} else {
		baseClasses.push('opacity-0');
	}

	if (filteredEvent) baseClasses.push('border', 'border-white/20');

	return (
		<div
			data-testid={day ? `day-${day}` : `empty-day-${index}`}
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
				{prophylaxisEvent && (
					<Tooltip
						className='-m-3 p-3'
						content={
							<>
								<p>
									{prophylaxisEvent.description.medication} {prophylaxisEvent.description.dose}
								</p>
								<p>{formatRecurrence(prophylaxisEvent.recurrence) ?? 'No recurrence'}</p>
							</>
						}
					>
						<Dot testId={`prophylaxis-indicator-${day}`} color='bg-cyan-400' />
					</Tooltip>
				)}
			</div>
		</div>
	);
}

export default CalendarDay;
