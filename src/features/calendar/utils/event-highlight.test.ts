import { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import type { MigraineDescription } from '@/features/calendar/types/event';
import {
	calculateMigrenosusFlags,
	determineStrength,
	getEventForDay,
} from '@/features/calendar/utils/event-highlight';
import { INTENSITY_TYPES } from '@/shared/constants/event/event-details';
import { describe, expect, it } from 'vitest';

const makeDescription = (overrides: Partial<MigraineDescription> = {}): MigraineDescription => ({
	duration: [],
	intensity: INTENSITY_TYPES.LOW,
	symptoms: [],
	medicine: '',
	effectiveness: [],
	midas: {
		workMissed: true,
		workImpaired: false,
		choresMissed: true,
		choresImpaired: false,
		socialMissed: false,
	},
	...overrides,
});

const makeEvent = (dateStr: string) => ({
	date: new Date(dateStr),
	description: makeDescription(),
	strength: 200 as keyof typeof STRENGTH_MAP,
});

const FIRST_DAY_JAN = new Date('2026-01-01');
const DAYS_IN_JAN = 31;

describe('getEventForDay', () => {
	it('returns undefined when day is null', () => {
		expect(getEventForDay(null, [makeEvent('2026-01-01')])).toBeUndefined();
	});

	it('returns undefined when day is 0', () => {
		expect(getEventForDay(0, [makeEvent('2026-01-01')])).toBeUndefined();
	});

	it('returns undefined when no event matches the day', () => {
		expect(getEventForDay(2, [makeEvent('2026-01-01')])).toBeUndefined();
	});

	it('returns undefined for an empty events array', () => {
		expect(getEventForDay(1, [])).toBeUndefined();
	});

	it('returns the event matching the day', () => {
		const event = makeEvent('2026-01-03');
		const events = [makeEvent('2026-01-01'), event, makeEvent('2026-01-05')];

		expect(getEventForDay(3, events)).toBe(event);
	});

	it('returns the first matching event when multiple events share the day', () => {
		const first = makeEvent('2026-01-03');
		const second = makeEvent('2026-01-03');

		expect(getEventForDay(3, [first, second])).toBe(first);
	});

	it('matches by day of month, ignoring month/year', () => {
		const event = makeEvent('2025-06-03');

		expect(getEventForDay(3, [event])).toBe(event);
	});
});

describe('determineStrength', () => {
	const validStrengths = Object.keys(STRENGTH_MAP)
		.map(Number)
		.sort((a, b) => a - b);

	it('always returns a value that exists in STRENGTH_MAP', () => {
		const result = determineStrength(makeDescription({ intensity: INTENSITY_TYPES.HIGH }));
		expect(validStrengths).toContain(result);
	});

	describe('intensity', () => {
		it('returns higher strength for VERY_HIGH than HIGH intensity', () => {
			const veryHigh = determineStrength(makeDescription({ intensity: INTENSITY_TYPES.VERY_HIGH }));
			const high = determineStrength(makeDescription({ intensity: INTENSITY_TYPES.HIGH }));
			expect(veryHigh).toBeGreaterThanOrEqual(high);
		});

		it('returns higher strength for HIGH than MEDIUM intensity', () => {
			const high = determineStrength(makeDescription({ intensity: INTENSITY_TYPES.HIGH }));
			const medium = determineStrength(makeDescription({ intensity: INTENSITY_TYPES.MEDIUM }));
			expect(high).toBeGreaterThanOrEqual(medium);
		});

		it('returns higher strength for MEDIUM than LOW intensity', () => {
			const medium = determineStrength(makeDescription({ intensity: INTENSITY_TYPES.MEDIUM }));
			const low = determineStrength(makeDescription({ intensity: INTENSITY_TYPES.LOW }));
			expect(medium).toBeGreaterThanOrEqual(low);
		});
	});

	describe('duration', () => {
		it('returns higher strength for longer duration', () => {
			const short = determineStrength(
				makeDescription({
					duration: [{ start: 0, end: 2 }],
				}),
			);
			const long = determineStrength(
				makeDescription({
					duration: [{ start: 0, end: 13 }],
				}),
			);
			expect(long).toBeGreaterThan(short);
		});

		it('accumulates duration across multiple ranges', () => {
			const single = determineStrength(
				makeDescription({
					duration: [{ start: 0, end: 13 }],
				}),
			);
			const split = determineStrength(
				makeDescription({
					duration: [
						{ start: 0, end: 7 },
						{ start: 8, end: 14 },
					],
				}),
			);
			expect(single).toBe(split);
		});

		it('picks the closest valid STRENGTH_MAP key', () => {
			const result = determineStrength(
				makeDescription({
					intensity: INTENSITY_TYPES.LOW,
					duration: [],
				}),
			);
			const closest = validStrengths.reduce((prev, curr) =>
				Math.abs(curr - 300) < Math.abs(prev - 300) ? curr : prev,
			);
			expect(result).toBe(closest);
		});
	});
});

describe('calculateMigrenosusFlags', () => {
	it('returns an array with length equal to daysInMonth', () => {
		const flags = calculateMigrenosusFlags([], FIRST_DAY_JAN, DAYS_IN_JAN);
		expect(flags).toHaveLength(DAYS_IN_JAN);
	});

	it('returns all false when events array is empty', () => {
		const flags = calculateMigrenosusFlags([], FIRST_DAY_JAN, DAYS_IN_JAN);
		expect(flags.every((f) => f === false)).toBe(true);
	});

	describe('streak detection', () => {
		it('flags days when streak meets the minimum (default 4)', () => {
			const events = ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04'].map(makeEvent);
			const flags = calculateMigrenosusFlags(events, FIRST_DAY_JAN, DAYS_IN_JAN);

			expect(flags[0]).toBe(true);
			expect(flags[1]).toBe(true);
			expect(flags[2]).toBe(true);
			expect(flags[3]).toBe(true);
		});

		it('does not flag days when streak is below minimum', () => {
			const events = ['2026-01-01', '2026-01-02', '2026-01-03'].map(makeEvent);
			const flags = calculateMigrenosusFlags(events, FIRST_DAY_JAN, DAYS_IN_JAN);

			expect(flags[0]).toBe(false);
			expect(flags[1]).toBe(false);
			expect(flags[2]).toBe(false);
		});

		it('respects a custom minDays value', () => {
			const events = ['2026-01-01', '2026-01-02'].map(makeEvent);
			const flags = calculateMigrenosusFlags(events, FIRST_DAY_JAN, DAYS_IN_JAN, 2);

			expect(flags[0]).toBe(true);
			expect(flags[1]).toBe(true);
		});

		it('resets streak when days are not consecutive', () => {
			const events = [
				'2026-01-01',
				'2026-01-02',
				'2026-01-03',
				'2026-01-04',
				'2026-01-06',
				'2026-01-07',
				'2026-01-08',
			].map(makeEvent);
			const flags = calculateMigrenosusFlags(events, FIRST_DAY_JAN, DAYS_IN_JAN);

			expect(flags[0]).toBe(true);
			expect(flags[5]).toBe(false);
			expect(flags[6]).toBe(false);
			expect(flags[7]).toBe(false);
		});

		it('handles multiple separate streaks independently', () => {
			const events = [
				'2026-01-01',
				'2026-01-02',
				'2026-01-03',
				'2026-01-04',
				'2026-01-10',
				'2026-01-11',
				'2026-01-12',
				'2026-01-13',
			].map(makeEvent);
			const flags = calculateMigrenosusFlags(events, FIRST_DAY_JAN, DAYS_IN_JAN);

			expect(flags[0]).toBe(true);
			expect(flags[3]).toBe(true);
			expect(flags[9]).toBe(true);
			expect(flags[12]).toBe(true);
			expect(flags[4]).toBe(false);
		});

		it('deduplicates multiple events on the same day', () => {
			const events = [
				makeEvent('2026-01-01'),
				makeEvent('2026-01-01'),
				makeEvent('2026-01-02'),
				makeEvent('2026-01-03'),
			];
			const flags = calculateMigrenosusFlags(events, FIRST_DAY_JAN, DAYS_IN_JAN, 4);

			expect(flags[0]).toBe(false);
		});
	});

	describe('edge-cases', () => {
		it('does not flag days outside the month range', () => {
			const events = ['2025-12-29', '2025-12-30', '2025-12-31', '2026-01-01'].map(makeEvent);
			const flags = calculateMigrenosusFlags(events, FIRST_DAY_JAN, DAYS_IN_JAN);

			expect(flags[0]).toBe(true);
			expect(flags.slice(1).every((f) => f === false)).toBe(true);
		});

		it('flags the last day of the month correctly', () => {
			const events = ['2026-01-28', '2026-01-29', '2026-01-30', '2026-01-31'].map(makeEvent);
			const flags = calculateMigrenosusFlags(events, FIRST_DAY_JAN, DAYS_IN_JAN);

			expect(flags[30]).toBe(true);
		});
	});
});
