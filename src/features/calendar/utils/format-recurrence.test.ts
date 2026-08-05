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
		it('returns the start date when it is not in the future', () => {
			const start = new Date('2026-01-10');
			const now = new Date('2026-01-15');

			expect(getNextRecurrenceDate(start, null, now)).toEqual(start);
		});

		it('returns null when the start date is in the future', () => {
			const start = new Date('2026-02-10');
			const now = new Date('2026-01-15');

			expect(getNextRecurrenceDate(start, null, now)).toBeNull();
		});

		it('treats an empty recurrence array the same as no recurrence', () => {
			const start = new Date('2026-01-10');
			const now = new Date('2026-01-15');

			expect(getNextRecurrenceDate(start, [], now)).toEqual(start);
		});
	});

	describe('with recurrence', () => {
		it('returns the occurrence that falls within the month of "now"', () => {
			const start = new Date('2026-01-01');
			const now = new Date('2026-02-15');

			expect(getNextRecurrenceDate(start, ['RRULE:FREQ=WEEKLY;INTERVAL=4'], now)).toEqual(
				new Date('2026-02-26'),
			);
		});

		it('returns the first occurrence when a month contains more than one', () => {
			const start = new Date('2026-01-01');
			const now = new Date('2026-01-20');

			expect(getNextRecurrenceDate(start, ['RRULE:FREQ=WEEKLY;INTERVAL=4'], now)).toEqual(
				new Date('2026-01-01'),
			);
		});

		it('returns null when the recurrence has no occurrence in the month of "now"', () => {
			const start = new Date('2026-01-31');
			const now = new Date('2026-04-10');

			expect(getNextRecurrenceDate(start, ['RRULE:FREQ=MONTHLY;BYMONTHDAY=31'], now)).toBeNull();
		});

		it('uses the given start date as dtstart, not the original event date embedded in the rule', () => {
			const start = new Date('2026-01-05');
			const now = new Date('2026-01-15');

			expect(getNextRecurrenceDate(start, ['RRULE:FREQ=WEEKLY'], now)).toEqual(
				new Date('2026-01-05'),
			);
		});

		it('falls back to the start date when the recurrence string is invalid', () => {
			const start = new Date('2026-01-10');
			const now = new Date('2026-01-15');

			expect(getNextRecurrenceDate(start, ['not-a-valid-rrule'], now)).toEqual(start);
		});
	});

	describe('default "now"', () => {
		it('defaults to the current date when not provided', () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-01-15'));

			const start = new Date('2026-01-10');

			expect(getNextRecurrenceDate(start, null)).toEqual(start);

			vi.useRealTimers();
		});
	});
});
