import type { MigraineEvent, ProphylaxisEvent } from '@/features/calendar/types/event';
import { determineStrength } from '@/features/calendar/utils/event-highlight';
import { parseEventDescription } from '@/features/calendar/utils/event-parser';
import type { RawEventResponse } from '@/shared/api/types/event';

export function mapMigraineEvents(raw: RawEventResponse[]): MigraineEvent[] {
	return raw
		.map((event) => {
			const description = parseEventDescription(event);
			if (!description) return null;
			return {
				date: new Date(event.start.date),
				description,
				strength: determineStrength(description),
			} satisfies MigraineEvent;
		})
		.filter((e): e is MigraineEvent => e !== null)
		.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function mapProphylaxisEvents(raw: RawEventResponse[]): ProphylaxisEvent[] {
	return raw
		.map(
			(event): ProphylaxisEvent => ({
				date: new Date(event.start.date),
				summary: event.summary,
			}),
		)
		.sort((a, b) => a.date.getTime() - b.date.getTime());
}
