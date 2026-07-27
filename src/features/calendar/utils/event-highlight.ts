import { STRENGTH_MAP, type StrengthKey } from '@/features/calendar/constants/calendar';
import type {
	DatedEvent,
	MigraineDescription,
	MigraineEvent,
} from '@/features/calendar/types/event';
import { INTENSITY_TYPES } from '@/shared/constants/event/event-details';

export const getEventForDay = <T extends DatedEvent>(
	day: number | null,
	events: T[],
): T | undefined => {
	if (!day) return undefined;
	return events.find((event) => event.date.getDate() === day);
};

export function determineStrength(description: MigraineDescription): MigraineEvent['strength'] {
	const totalDuration = description.duration.reduce(
		(sum, range) => sum + (range.end - range.start),
		0,
	);
	let baseStrength = 200;

	if (description.intensity === INTENSITY_TYPES.VERY_HIGH) {
		baseStrength += 500;
	} else if (description.intensity === INTENSITY_TYPES.HIGH) {
		baseStrength += 350;
	} else if (description.intensity === INTENSITY_TYPES.MEDIUM) {
		baseStrength += 200;
	} else if (description.intensity === INTENSITY_TYPES.LOW) {
		baseStrength += 100;
	}

	if (totalDuration > 12) {
		baseStrength += 300;
	} else if (totalDuration > 8) {
		baseStrength += 200;
	} else if (totalDuration > 4) {
		baseStrength += 100;
	} else if (totalDuration > 2) {
		baseStrength += 50;
	}

	const validStrengths = Object.keys(STRENGTH_MAP).map(Number);

	return validStrengths.reduce((prev, curr) =>
		Math.abs(curr - baseStrength) < Math.abs(prev - baseStrength) ? curr : prev,
	) as StrengthKey;
}

export function calculateMigrenosusFlags(
	events: MigraineEvent[],
	firstDayOfMonth: Date,
	daysInMonth: number,
	minDays = 4,
): boolean[] {
	const flags = Array(daysInMonth).fill(false);
	if (!events.length) return flags;

	const normalizeDay = (date: Date) =>
		new Date(date.getFullYear(), date.getMonth(), date.getDate());

	const eventDays = new Set(events.map((e) => normalizeDay(e.date).getTime()));

	const sortedDates = [...eventDays]
		.map((time) => new Date(time))
		.sort((a, b) => a.getTime() - b.getTime());

	const isNextDay = (a: Date, b: Date) => {
		const next = new Date(b);
		next.setDate(next.getDate() + 1);

		return next.getTime() === a.getTime();
	};

	let streak: Date[] = [];

	const flushStreak = () => {
		if (streak.length >= minDays) {
			for (const date of streak) {
				const dayIndex = Math.floor(
					(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
						Date.UTC(
							firstDayOfMonth.getFullYear(),
							firstDayOfMonth.getMonth(),
							firstDayOfMonth.getDate(),
						)) /
						86400000,
				);

				if (dayIndex >= 0 && dayIndex < daysInMonth) {
					flags[dayIndex] = true;
				}
			}
		}
		streak = [];
	};

	for (let index = 0; index < sortedDates.length; index++) {
		const curr = sortedDates[index];
		const prev = sortedDates[index - 1];

		if (index === 0 || isNextDay(curr, prev)) {
			streak.push(curr);
		} else {
			flushStreak();
			streak.push(curr);
		}
	}

	flushStreak();
	return flags;
}
