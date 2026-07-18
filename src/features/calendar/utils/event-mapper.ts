import type { MigraineEvent, ProphylaxisEvent } from '@/features/calendar/types/event';
import { determineStrength } from '@/features/calendar/utils/event-highlight';
import {
	parseMigraineEventDescription,
	parseProphylaxisEventDescription,
} from '@/features/calendar/utils/event-parser';
import type { RawEventResponse } from '@/shared/api/types/event';

export function mapMigraineEvents(raw: RawEventResponse[]): MigraineEvent[] {
	return raw
		.map((event) => {
			const description = parseMigraineEventDescription(event);
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

// TODO tests bc recurrence
export function mapProphylaxisEvents(raw: RawEventResponse[]): ProphylaxisEvent[] {
	return raw
		.map((event) => {
			return {
				date: new Date(event.start.date),
				description: parseProphylaxisEventDescription(event),
				recurrence: event.recurrence,
			} satisfies ProphylaxisEvent;
		})
		.sort((a, b) => a.date.getTime() - b.date.getTime());
}
