import type { MigraineEvent, ProphylaxisEvent } from '@/features/calendar/types/event';
import { determineStrength } from '@/features/calendar/utils/event-highlight';
import {
	parseMigraineEventDescription,
	parseProphylaxisEventDescription,
} from '@/features/calendar/utils/event-parser';
import { getNextRecurrenceDate } from '@/features/calendar/utils/format-recurrence';
import type { RawEventResponse } from '@/shared/api/types/event';
import { parseDateOnlyLocal } from '@/shared/utils/date';

export function mapMigraineEvents(raw: RawEventResponse[]): MigraineEvent[] {
	return raw
		.map((event) => {
			try {
				const description = parseMigraineEventDescription(event);

				if (!description) return null;

				return {
					date: parseDateOnlyLocal(event.start.date),
					description,
					strength: determineStrength(description),
				} satisfies MigraineEvent;
			} catch {
				return null;
			}
		})
		.filter((e): e is MigraineEvent => e !== null)
		.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function mapProphylaxisEvents(raw: RawEventResponse[], now?: Date): ProphylaxisEvent[] {
	return raw
		.map((event) => {
			try {
				const description = parseProphylaxisEventDescription(event);
				const date = getNextRecurrenceDate(
					parseDateOnlyLocal(event.start.date),
					event.recurrence,
					now,
				);
				if (!description || !date) return null;

				return {
					date,
					description,
					recurrence: event.recurrence,
				} satisfies ProphylaxisEvent;
			} catch {
				return null;
			}
		})
		.filter((e): e is ProphylaxisEvent => e !== null)
		.sort((a, b) => a.date.getTime() - b.date.getTime());
}
