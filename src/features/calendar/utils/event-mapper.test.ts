import { determineStrength } from '@/features/calendar/utils/event-highlight';
import { mapMigraineEvents, mapProphylaxisEvents } from '@/features/calendar/utils/event-mapper';
import { parseEventDescription } from '@/features/calendar/utils/event-parser';
import type { RawEventResponse } from '@/shared/api/types/event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/utils/event-parser', () => ({
	parseEventDescription: vi.fn(),
}));
vi.mock('@/features/calendar/utils/event-highlight', () => ({
	determineStrength: vi.fn(),
}));

const makeRawEvent = (dateStr: string, overrides: Partial<RawEventResponse> = {}) =>
	({
		start: { date: dateStr },
		summary: 'Migräne',
		...overrides,
	}) as RawEventResponse;

describe('mapMigraineEvents', () => {
	beforeEach(() => {
		vi.mocked(parseEventDescription).mockReturnValue({} as any);
		vi.mocked(determineStrength).mockReturnValue(200);
	});

	it('maps raw events to MigraineEvent objects', () => {
		const description = { intensity: 'high' } as any;
		vi.mocked(parseEventDescription).mockReturnValue(description);
		vi.mocked(determineStrength).mockReturnValue(500);

		const [result] = mapMigraineEvents([makeRawEvent('2026-01-10')]);

		expect(result.date).toEqual(new Date('2026-01-10'));
		expect(result.description).toBe(description);
		expect(result.strength).toBe(500);
	});

	it('calls determineStrength with the parsed description', () => {
		const description = { intensity: 'low' } as any;
		vi.mocked(parseEventDescription).mockReturnValue(description);

		mapMigraineEvents([makeRawEvent('2026-01-10')]);

		expect(determineStrength).toHaveBeenCalledWith(description);
	});

	it('drops events where parseEventDescription returns null', () => {
		vi.mocked(parseEventDescription)
			.mockReturnValueOnce(null)
			.mockReturnValueOnce({} as any);

		const result = mapMigraineEvents([makeRawEvent('2026-01-10'), makeRawEvent('2026-01-11')]);

		expect(result).toHaveLength(1);
		expect(result[0].date).toEqual(new Date('2026-01-11'));
	});

	it('sorts events by date ascending', () => {
		const result = mapMigraineEvents([
			makeRawEvent('2026-01-20'),
			makeRawEvent('2026-01-05'),
			makeRawEvent('2026-01-12'),
		]);

		const dates = result.map((e) => e.date.toISOString());
		expect(dates).toEqual([...dates].sort());
	});

	it('returns an empty array for no events', () => {
		expect(mapMigraineEvents([])).toEqual([]);
	});
});

describe('mapProphylaxisEvents', () => {
	it('maps raw events to ProphylaxisEvent objects', () => {
		const [result] = mapProphylaxisEvents([makeRawEvent('2026-01-10', { summary: 'Botox' })]);

		expect(result).toEqual({ date: new Date('2026-01-10'), summary: 'Botox' });
	});

	it('sorts events by date ascending', () => {
		const result = mapProphylaxisEvents([makeRawEvent('2026-01-20'), makeRawEvent('2026-01-05')]);

		expect(result[0].date).toEqual(new Date('2026-01-05'));
		expect(result[1].date).toEqual(new Date('2026-01-20'));
	});

	it('returns an empty array for no events', () => {
		expect(mapProphylaxisEvents([])).toEqual([]);
	});
});
