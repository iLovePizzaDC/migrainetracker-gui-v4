import CalendarContent from '@/features/calendar/components/organisms/CalendarContent';
import MigrainePanel from '@/features/calendar/components/organisms/MigrainePanel';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import type { Entry, StoredEntry } from '@/features/calendar/types/calendar';
import {
	createEntry,
	enrichMedicineLabels,
	isSavedEntryRaw,
} from '@/features/calendar/utils/event-parser';
import { useUser } from '@/shared/hooks/use-user';
import type { DropdownOption } from '@/shared/types/input';
import { normalizeDate } from '@/shared/utils/date';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useCallback, useMemo, useState } from 'react';
import { ENTRY_STORAGE_KEY } from '@/features/calendar/constants/calendar';
import CalendarHeader from '@/features/calendar/components/molecules/content/CalendarHeader';
import FilterCard from '@/features/calendar/components/molecules/forms/FilterCard';

function Calendar() {
	const { isLoading, date, calendarEvents, setMonth } = useCalendar();
	const { medicines } = useUser();

	const [isPanelOpen, setIsPanelOpen] = useState(false);
	const [entry, setEntry] = useState<Entry | null>(null);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [isStoredEntryDisplaying, setIsStoredEntryDisplaying] = useState(false);

	const medicineOptions: DropdownOption[] = useMemo(
		() =>
			medicines === null
				? []
				: medicines.map((m) => ({
						label: m.name,
						value: m.abbreviation,
					})),
		[medicines],
	);

	const onDayClick = useCallback(
		(day: number) => {
			const selected = new Date(date);
			selected.setDate(day);
			const isSameDate =
				selectedDate !== null &&
				normalizeDate(selected).getTime() === normalizeDate(selectedDate).getTime();

			if (isSameDate) {
				setIsPanelOpen(false);
				setSelectedDate(null);
				setEntry(null);
				return;
			}

			const foundEvent = calendarEvents.find(
				(event) => normalizeDate(event.date).getTime() === normalizeDate(selected).getTime(),
			);

			const newEntry: Entry | null = foundEvent ? createEntry(foundEvent) : null;

			if (newEntry) {
				newEntry.medicines = enrichMedicineLabels(newEntry.medicines, medicineOptions);
			}

			setIsStoredEntryDisplaying(false);
			setEntry(newEntry);
			setSelectedDate(selected);
			setIsPanelOpen(true);
		},
		[date, selectedDate, calendarEvents, medicineOptions],
	);

	const onLoadEntryClick = useCallback(() => {
		try {
			const rawStoredEntry = localStorage.getItem(ENTRY_STORAGE_KEY);
			if (!rawStoredEntry) return;

			const parsed = JSON.parse(rawStoredEntry) as unknown;
			if (!isSavedEntryRaw(parsed)) return;

			const entryDate = normalizeDate(new Date(parsed.date));
			const entryToSet: StoredEntry = { ...parsed, date: entryDate };

			setIsStoredEntryDisplaying(true);
			setMonth(entryDate);
			setEntry(entryToSet);
			setSelectedDate(entryDate);
			setIsPanelOpen(true);
		} catch (err) {
			console.error('Failed to load cached entry', err);
		}
	}, [setMonth]);

	return (
		<>
			<div className='glass-panel relative mx-auto flex w-full max-w-md flex-col p-5 sm:p-6'>
				<div className='flex-1 flex flex-col'>
					<CalendarHeader />
					<CalendarContent openDate={selectedDate} onDayClick={onDayClick} />
				</div>

				<div className='mt-3 flex justify-end border-t border-white/[0.06] pt-3'>
					<button
						data-testid='load-entry'
						onClick={onLoadEntryClick}
						className='icon-btn'
						disabled={isLoading}
						aria-label='Load saved entry'
					>
						<ArrowDownTrayIcon />
					</button>
				</div>
			</div>
			<FilterCard />
			<div className='mt-4'>
				<MigrainePanel
					date={selectedDate ?? date}
					onClose={() => {
						setIsPanelOpen(false);
						setSelectedDate(null);
						setEntry(null);
					}}
					isOpen={!!isPanelOpen}
					prefilled={entry}
					disabled={!!entry && !isStoredEntryDisplaying}
				/>
			</div>
		</>
	);
}

export default Calendar;
