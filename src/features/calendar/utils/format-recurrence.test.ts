import {
	formatRecurrence,
	getNextRecurrenceDate,
} from '@/features/calendar/utils/format-recurrence';
import { describe, expect, it, vi } from 'vitest';

describe('formatRecurrence', () => {
	it('returns null for undefined', () => {
		expect(formatRecurrence(null)).toBeNull();
	});

	it('returns null for an empty array', () => {
		expect(formatRecurrence([])).toBeNull();
	});

	it('returns null when FREQ is missing or unknown', () => {
		expect(formatRecurrence(['RRULE:INTERVAL=4'])).toBeNull();
		expect(formatRecurrence(['RRULE:FREQ=INVALID'])).toBeNull();
	});

	it('formats weekly with interval', () => {
		expect(formatRecurrence(['RRULE:FREQ=WEEKLY;INTERVAL=4'])).toBe('every 4 weeks');
	});

	it('formats weekly without interval as "Every week"', () => {
		expect(formatRecurrence(['RRULE:FREQ=WEEKLY'])).toBe('every week');
	});

	it('formats daily, monthly, yearly correctly', () => {
		expect(formatRecurrence(['RRULE:FREQ=DAILY'])).toBe('every day');
		expect(formatRecurrence(['RRULE:FREQ=MONTHLY;INTERVAL=2'])).toBe('every 2 months');
		expect(formatRecurrence(['RRULE:FREQ=YEARLY'])).toBe('every year');
	});

	it('appends BYDAY weekdays in English abbreviations', () => {
		expect(formatRecurrence(['RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR'])).toBe(
			'every week on Monday, Wednesday, Friday',
		);
	});
});

describe('getNextRecurrenceDate', () => {
	describe('without recurrence', () => {
		it('returns the start date when it is in the same month as viewDate', () => {
			const start = new Date(2026, 0, 10);
			const viewDate = new Date(2026, 0, 1);

			expect(getNextRecurrenceDate(start, null, viewDate)).toEqual(start);
		});

		it('returns null when the start date is in a different month', () => {
			const start = new Date(2026, 1, 10);
			const viewDate = new Date(2026, 0, 15);

			expect(getNextRecurrenceDate(start, null, viewDate)).toBeNull();
		});

		it('returns null for a past event outside the viewed month (no ghost dots)', () => {
			const start = new Date(2026, 0, 15);
			const viewDate = new Date(2026, 1, 1);

			expect(getNextRecurrenceDate(start, null, viewDate)).toBeNull();
		});

		it('treats an empty recurrence array the same as no recurrence', () => {
			const start = new Date(2026, 0, 10);
			const viewDate = new Date(2026, 0, 15);

			expect(getNextRecurrenceDate(start, [], viewDate)).toEqual(start);
		});
	});

	describe('with recurrence', () => {
		it('returns the occurrence that falls within the month of viewDate', () => {
			const start = new Date('2026-01-01');
			const viewDate = new Date('2026-02-15');

			expect(getNextRecurrenceDate(start, ['RRULE:FREQ=WEEKLY;INTERVAL=4'], viewDate)).toEqual(
				new Date('2026-02-26'),
			);
		});

		it('returns the first occurrence when a month contains more than one', () => {
			const start = new Date('2026-01-01');
			const viewDate = new Date('2026-01-20');

			expect(getNextRecurrenceDate(start, ['RRULE:FREQ=WEEKLY;INTERVAL=4'], viewDate)).toEqual(
				new Date('2026-01-01'),
			);
		});

		it('returns null when the recurrence has no occurrence in the month of viewDate', () => {
			const start = new Date('2026-01-31');
			const viewDate = new Date('2026-04-10');

			expect(
				getNextRecurrenceDate(start, ['RRULE:FREQ=MONTHLY;BYMONTHDAY=31'], viewDate),
			).toBeNull();
		});

		it('uses the given start date as dtstart, not the original event date embedded in the rule', () => {
			const start = new Date('2026-01-05');
			const viewDate = new Date('2026-01-15');

			expect(getNextRecurrenceDate(start, ['RRULE:FREQ=WEEKLY'], viewDate)).toEqual(
				new Date('2026-01-05'),
			);
		});

		it('falls back to the start date when the recurrence string is invalid and same month', () => {
			const start = new Date(2026, 0, 10);
			const viewDate = new Date(2026, 0, 15);

			expect(getNextRecurrenceDate(start, ['not-a-valid-rrule'], viewDate)).toEqual(start);
		});

		it('returns null for invalid recurrence when start is outside the viewed month', () => {
			const start = new Date(2026, 0, 10);
			const viewDate = new Date(2026, 1, 1);

			expect(getNextRecurrenceDate(start, ['not-a-valid-rrule'], viewDate)).toBeNull();
		});
	});

	describe('default viewDate', () => {
		it('defaults to the current date when not provided', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date(2026, 0, 15));

			const start = new Date(2026, 0, 10);

			expect(getNextRecurrenceDate(start, null)).toEqual(start);

			vi.useRealTimers();
		});
	});
});
