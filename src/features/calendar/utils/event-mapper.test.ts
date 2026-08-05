import { determineStrength } from '@/features/calendar/utils/event-highlight';
import { mapMigraineEvents, mapProphylaxisEvents } from '@/features/calendar/utils/event-mapper';
import {
	parseMigraineEventDescription,
	parseProphylaxisEventDescription,
} from '@/features/calendar/utils/event-parser';
import { getNextRecurrenceDate } from '@/features/calendar/utils/format-recurrence';
import type { RawEventResponse } from '@/shared/api/types/event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/utils/event-parser', () => ({
	parseMigraineEventDescription: vi.fn(),
	parseProphylaxisEventDescription: vi.fn(),
}));
vi.mock('@/features/calendar/utils/event-highlight', () => ({
	determineStrength: vi.fn(),
}));
vi.mock('@/features/calendar/utils/format-recurrence', () => ({
	getNextRecurrenceDate: vi.fn(),
}));

const makeRawMigraineEvent = (dateStr: string, overrides: Partial<RawEventResponse> = {}) =>
	({
		start: { date: dateStr },
		summary: 'Migräne',
		...overrides,
	}) as RawEventResponse;

const makeRawProphylaxisEvent = (dateStr: string, overrides: Partial<RawEventResponse> = {}) =>
	({
		start: { date: dateStr },
		summary: 'Prophylaxis',
		...overrides,
	}) as RawEventResponse;

describe('mapMigraineEvents', () => {
	beforeEach(() => {
		vi.mocked(parseMigraineEventDescription).mockReturnValue({} as any);
		vi.mocked(determineStrength).mockReturnValue(200);
	});

	it('maps raw events to MigraineEvent objects', () => {
		const description = { intensity: 'high' } as any;
		vi.mocked(parseMigraineEventDescription).mockReturnValue(description);
		vi.mocked(determineStrength).mockReturnValue(500);

		const [result] = mapMigraineEvents([makeRawMigraineEvent('2026-01-10')]);

		expect(result.date).toEqual(new Date('2026-01-10'));
		expect(result.description).toBe(description);
		expect(result.strength).toBe(500);
	});

	it('calls determineStrength with the parsed description', () => {
		const description = { intensity: 'low' } as any;
		vi.mocked(parseMigraineEventDescription).mockReturnValue(description);

		mapMigraineEvents([makeRawMigraineEvent('2026-01-10')]);

		expect(determineStrength).toHaveBeenCalledWith(description);
	});

	it('drops events where parseEventDescription returns null', () => {
		vi.mocked(parseMigraineEventDescription)
			.mockReturnValueOnce(null)
			.mockReturnValueOnce({} as any);

		const result = mapMigraineEvents([
			makeRawMigraineEvent('2026-01-10'),
			makeRawMigraineEvent('2026-01-11'),
		]);

		expect(result).toHaveLength(1);
		expect(result[0].date).toEqual(new Date('2026-01-11'));
	});

	it('sorts events by date ascending', () => {
		const result = mapMigraineEvents([
			makeRawMigraineEvent('2026-01-20'),
			makeRawMigraineEvent('2026-01-05'),
			makeRawMigraineEvent('2026-01-12'),
		]);

		const dates = result.map((e) => e.date.toISOString());
		expect(dates).toEqual([...dates].sort());
	});

	it('returns an empty array for no events', () => {
		expect(mapMigraineEvents([])).toEqual([]);
	});
});

describe('mapProphylaxisEvents', () => {
	beforeEach(() => {
		vi.mocked(parseProphylaxisEventDescription).mockReturnValue({} as any);
		vi.mocked(getNextRecurrenceDate).mockImplementation((startDate) => startDate);
	});

	it('maps raw events to ProphylaxisEvent objects using the resolved recurrence date', () => {
		const description = { medication: 'aimovig', dose: '70mg' } as any;
		const resolvedDate = new Date('2026-01-15');
		vi.mocked(parseProphylaxisEventDescription).mockReturnValue(description);
		vi.mocked(getNextRecurrenceDate).mockReturnValue(resolvedDate);

		const [result] = mapProphylaxisEvents([makeRawProphylaxisEvent('2026-01-10')]);

		expect(result.date).toEqual(resolvedDate);
		expect(result.description).toBe(description);
	});

	it('calls parseProphylaxisEventDescription with the raw event', () => {
		const event = makeRawProphylaxisEvent('2026-01-10');

		mapProphylaxisEvents([event]);

		expect(parseProphylaxisEventDescription).toHaveBeenCalledWith(event);
	});

	it('calls getNextRecurrenceDate with the start date, recurrence and now', () => {
		const event = makeRawProphylaxisEvent('2026-01-10', { recurrence: ['RRULE:FREQ=WEEKLY'] });
		const now = new Date('2026-01-01');

		mapProphylaxisEvents([event], now);

		expect(getNextRecurrenceDate).toHaveBeenCalledWith(
			new Date('2026-01-10'),
			['RRULE:FREQ=WEEKLY'],
			now,
		);
	});

	it('calls getNextRecurrenceDate with undefined now when not provided', () => {
		const event = makeRawProphylaxisEvent('2026-01-10');

		mapProphylaxisEvents([event]);

		expect(getNextRecurrenceDate).toHaveBeenCalledWith(
			new Date('2026-01-10'),
			undefined,
			undefined,
		);
	});

	it('maps the recurrence field from the raw event', () => {
		const event = makeRawProphylaxisEvent('2026-01-10', { recurrence: ['RRULE:FREQ=WEEKLY'] });

		const [result] = mapProphylaxisEvents([event]);

		expect(result.recurrence).toEqual(['RRULE:FREQ=WEEKLY']);
	});

	it('sets recurrence to undefined when the raw event has none', () => {
		const event = makeRawProphylaxisEvent('2026-01-10', { recurrence: undefined });

		const [result] = mapProphylaxisEvents([event]);

		expect(result.recurrence).toBeUndefined();
	});

	it('drops events where parseProphylaxisEventDescription returns null', () => {
		vi.mocked(parseProphylaxisEventDescription)
			.mockReturnValueOnce(null)
			.mockReturnValueOnce({} as any);

		const result = mapProphylaxisEvents([
			makeRawProphylaxisEvent('2026-01-10'),
			makeRawProphylaxisEvent('2026-01-11'),
		]);

		expect(result).toHaveLength(1);
	});

	it('drops events where getNextRecurrenceDate returns null (no occurrence in range)', () => {
		vi.mocked(getNextRecurrenceDate)
			.mockReturnValueOnce(null)
			.mockReturnValueOnce(new Date('2026-01-11'));

		const result = mapProphylaxisEvents([
			makeRawProphylaxisEvent('2026-01-10'),
			makeRawProphylaxisEvent('2026-01-11'),
		]);

		expect(result).toHaveLength(1);
		expect(result[0].date).toEqual(new Date('2026-01-11'));
	});

	it('sorts events by the resolved date ascending', () => {
		vi.mocked(getNextRecurrenceDate)
			.mockReturnValueOnce(new Date('2026-01-20'))
			.mockReturnValueOnce(new Date('2026-01-05'));

		const result = mapProphylaxisEvents([
			makeRawProphylaxisEvent('2026-01-20'),
			makeRawProphylaxisEvent('2026-01-05'),
		]);

		expect(result[0].date).toEqual(new Date('2026-01-05'));
		expect(result[1].date).toEqual(new Date('2026-01-20'));
	});

	it('returns an empty array for no events', () => {
		expect(mapProphylaxisEvents([])).toEqual([]);
	});
});
