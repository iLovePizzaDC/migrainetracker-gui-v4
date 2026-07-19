import { MIGRAINOSUS_FLAG_THRESHOLD } from '@/features/calendar/constants/calendar';
import type { MigraineEvent, ProphylaxisEvent } from '@/features/calendar/types/event';
import { calculateMigrenosusFlags } from '@/features/calendar/utils/event-highlight';
import { mapMigraineEvents, mapProphylaxisEvents } from '@/features/calendar/utils/event-mapper';
import { filterEvents, isDefaultFilter } from '@/features/calendar/utils/filter';
import { fetchMigraineEvents } from '@/shared/api/migraine.api';
import { fetchProphylaxisEvents } from '@/shared/api/prophylaxis';
import type { EventFilter } from '@/shared/types/event/event';
import { formatDateToUs, getDateAfterDays, getDateBeforeDays } from '@/shared/utils/date/date';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useCalendarEvents(
	firstDayOfMonth: Date,
	lastDayOfMonth: Date,
	daysInMonth: number,
) {
	const [rawEvents, setRawEvents] = useState<MigraineEvent[]>([]);
	const [migrainosusFlags, setMigrenosusFlags] = useState<boolean[]>([]);
	const [prophylaxisEvents, setProphylaxisEvents] = useState<ProphylaxisEvent[]>([]);
	const [filter, setFilter] = useState<EventFilter>({
		intensity: null,
		symptom: [],
		medicine: [],
		effectiveness: null,
		midas: [],
	});
	const [isLoading, setIsLoading] = useState(true);

	const fetchIdRef = useRef(0);

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

	const loadEvents = useCallback(
		async (abortController?: AbortController) => {
			const id = ++fetchIdRef.current;
			setIsLoading(true);

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
					fetchProphylaxisEvents(
						formatDateToUs(firstDayOfMonth),
						formatDateToUs(lastDayOfMonth),
						abortController?.signal,
					),
				]);

				if (!migraineEventsRaw || !prophylaxisEventsRaw || id !== fetchIdRef.current) return;

				setRawEvents(mapMigraineEvents(migraineEventsRaw));
				setProphylaxisEvents(mapProphylaxisEvents(prophylaxisEventsRaw));
			} catch (err) {
				if (!(err instanceof DOMException && err.name === 'AbortError')) {
					console.error('Failed to load events:', err);
				}
			} finally {
				setIsLoading(false);
			}
		},
		[firstDayOfMonth, lastDayOfMonth],
	);

	useEffect(() => {
		const abortController = new AbortController();
		loadEvents(abortController);

		return () => abortController.abort();
	}, [loadEvents]);

	useEffect(() => {
		setMigrenosusFlags(
			calculateMigrenosusFlags(rawEvents, firstDayOfMonth, daysInMonth, MIGRAINOSUS_FLAG_THRESHOLD),
		);
	}, [rawEvents, filter, daysInMonth, firstDayOfMonth, lastDayOfMonth]);

	const refetchEvents = useCallback(async () => loadEvents(new AbortController()), [loadEvents]);

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
