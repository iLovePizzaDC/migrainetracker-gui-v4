import { MIGRAINOSUS_FLAG_THRESHOLD } from '@/features/calendar/constants/calendar';
import type { MigraineEvent, ProphylaxisEvent } from '@/features/calendar/types/event';
import { calculateMigrainosusFlags } from '@/features/calendar/utils/event-highlight';
import { mapMigraineEvents, mapProphylaxisEvents } from '@/features/calendar/utils/event-mapper';
import { filterEvents, isDefaultFilter } from '@/features/calendar/utils/filter';
import { fetchMigraineEvents } from '@/shared/api/migraine.api';
import { fetchProphylaxisEvents } from '@/shared/api/prophylaxis';
import type { EventFilter } from '@/shared/types/event';
import { formatDateToUs, getDateAfterDays, getDateBeforeDays } from '@/shared/utils/date';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useCalendarEvents(
	firstDayOfMonth: Date,
	lastDayOfMonth: Date,
	daysInMonth: number,
) {
	const fetchIdRef = useRef(0);

	const [rawEvents, setRawEvents] = useState<MigraineEvent[]>([]);
	const [prophylaxisEvents, setProphylaxisEvents] = useState<ProphylaxisEvent[]>([]);
	const [filter, setFilter] = useState<EventFilter>({
		intensity: null,
		symptom: [],
		medicine: [],
		effectiveness: null,
		midas: [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const [prevFirstDayOfMonth, setPrevFirstDayOfMonth] = useState(firstDayOfMonth);
	const [prevLastDayOfMonth, setPrevLastDayOfMonth] = useState(lastDayOfMonth);

	if (
		firstDayOfMonth.getTime() !== prevFirstDayOfMonth.getTime() ||
		lastDayOfMonth.getTime() !== prevLastDayOfMonth.getTime()
	) {
		setPrevFirstDayOfMonth(firstDayOfMonth);
		setPrevLastDayOfMonth(lastDayOfMonth);
		setIsLoading(true);
	}

	const calendarEvents = useMemo(() => {
		const start = new Date(firstDayOfMonth);
		start.setHours(0, 0, 0, 0);

		const end = new Date(lastDayOfMonth);
		end.setHours(23, 59, 59, 999);

		return rawEvents.filter((event) => event.date >= start && event.date <= end);
	}, [rawEvents, firstDayOfMonth, lastDayOfMonth]);

	const filteredEvents = useMemo(() => {
		if (isDefaultFilter(filter)) return [];

		return calendarEvents.filter((event) => filterEvents(event, filter));
	}, [calendarEvents, filter]);

	const migrainosusFlags = useMemo(
		() =>
			calculateMigrainosusFlags(
				rawEvents,
				firstDayOfMonth,
				daysInMonth,
				MIGRAINOSUS_FLAG_THRESHOLD,
			),
		[rawEvents, firstDayOfMonth, daysInMonth],
	);

	const loadEvents = useCallback(
		async (abortController?: AbortController) => {
			const id = ++fetchIdRef.current;

			try {
				const fetchStart = getDateBeforeDays(firstDayOfMonth, MIGRAINOSUS_FLAG_THRESHOLD);
				const fetchEnd = getDateAfterDays(lastDayOfMonth, MIGRAINOSUS_FLAG_THRESHOLD);

				const [migraineEventsRaw, prophylaxisEventsRaw] = await Promise.all([
					fetchMigraineEvents(
						formatDateToUs(fetchStart),
						formatDateToUs(fetchEnd),
						undefined,
						abortController?.signal,
					),
					fetchProphylaxisEvents(abortController?.signal),
				]);

				if (!migraineEventsRaw || !prophylaxisEventsRaw || id !== fetchIdRef.current) {
					return;
				}

				setRawEvents(mapMigraineEvents(migraineEventsRaw));
				setProphylaxisEvents(mapProphylaxisEvents(prophylaxisEventsRaw));
			} catch (err) {
				if (!(err instanceof DOMException && err.name === 'AbortError')) {
					console.error('Failed to load events:', err);
				}
			} finally {
				if (id === fetchIdRef.current) {
					setIsLoading(false);
				}
			}
		},
		[firstDayOfMonth, lastDayOfMonth],
	);

	useEffect(() => {
		const abortController = new AbortController();

		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadEvents(abortController);

		return () => abortController.abort();
	}, [loadEvents]);

	const refetchEvents = useCallback(async () => {
		setIsLoading(true);
		await loadEvents(new AbortController());
	}, [loadEvents]);

	return {
		calendarEvents,
		filteredEvents,
		migrainosusFlags,
		prophylaxisEvents,
		filter,
		setFilter,
		isLoading,
		refetchEvents,
	};
}
