import { formatRecurrence } from '@/features/calendar/utils/format-recurrence';
import { describe, expect, it } from 'vitest';

describe('formatRecurrence', () => {
	it('returns null for undefined', () => {
		expect(formatRecurrence(null)).toBeNull();
	});

	it('returns null for an empty array', () => {
		expect(formatRecurrence([])).toBeNull();
	});

	it('returns null when FREQ is missing or unknown', () => {
		expect(formatRecurrence(['RRULE:INTERVAL=4'])).toBeNull();
		expect(formatRecurrence(['RRULE:FREQ=HOURLY'])).toBeNull();
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
			'every week (Mon, Wed, Fri)',
		);
	});
});
