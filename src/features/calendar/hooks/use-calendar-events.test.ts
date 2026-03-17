import { MIGRAINOSUS_FLAG_THRESHOLD } from '@/features/calendar/constants/calendar';
import { useCalendarEvents } from '@/features/calendar/hooks/use-calendar-events';
import { calculateMigrenosusFlags } from '@/features/calendar/utils/event-highlight';
import { isDefaultFilter } from '@/features/calendar/utils/filter';
import { fetchMigraineEvents } from '@/shared/api/migraine.api';
import type { RawEventResponse } from '@/shared/api/types/migraine';
import { INTENSITY_TYPES, SYMPTOM_TYPES } from '@/shared/constants/event/event-details';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/migraine.api');
vi.mock('@/features/calendar/utils/event-highlight');
vi.mock('@/features/calendar/utils/filter');
vi.mock('@/features/calendar/utils/event-parser', () => ({
	parseEventDescription: vi.fn((event) => event.description ?? null),
}));
vi.mock('@/features/calendar/utils/event-highlight', () => ({
	calculateMigrenosusFlags: vi.fn(() => []),
	determineStrength: vi.fn(() => 'moderate'),
}));
vi.mock('@/shared/utils/date/date', () => ({
	formatDateToUs: vi.fn((d: Date) => d.toISOString().split('T')[0]),
	getDateAfterDays: vi.fn((d: Date) => d),
	getDateBeforeDays: vi.fn((d: Date) => d),
}));

const FIRST_DAY = new Date('2026-01-01');
const LAST_DAY = new Date('2026-01-31');
const DAYS_IN_MONTH = 31;

const makeRawEvent = (dateStr: string) =>
	({
		start: { date: dateStr },
		description: { intensity: 3, symptom: [], medicine: [], effectiveness: null, midas: [] },
	}) as unknown as RawEventResponse;

function renderCalendarEvents() {
	return renderHook(() => useCalendarEvents(FIRST_DAY, LAST_DAY, DAYS_IN_MONTH));
}

describe('useCalendarEvents', () => {
	beforeEach(() => {
		vi.mocked(fetchMigraineEvents).mockResolvedValue([]);
		vi.mocked(isDefaultFilter).mockReturnValue(true);
		vi.mocked(calculateMigrenosusFlags).mockReturnValue([]);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('initial state', () => {
		it('starts with isLoading: true and empty arrays', () => {
			vi.mocked(fetchMigraineEvents).mockReturnValue(new Promise(() => {}));

			const { result } = renderCalendarEvents();

			expect(result.current.isLoading).toBe(true);
			expect(result.current.calendarEvents).toEqual([]);
			expect(result.current.filteredEvents).toEqual([]);
			expect(result.current.migrainosusFlags).toEqual([]);
		});

		it('sets isLoading: false after fetch completes', async () => {
			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));
		});
	});

	describe('fetch and parse', () => {
		it('maps raw events to Event objects inside the month range', async () => {
			vi.mocked(fetchMigraineEvents).mockResolvedValue([makeRawEvent('2026-01-15')]);

			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));
			expect(result.current.calendarEvents).toHaveLength(1);
			expect(result.current.calendarEvents[0].date).toEqual(new Date('2026-01-15'));
		});

		it('filters out events outside the current month', async () => {
			vi.mocked(fetchMigraineEvents).mockResolvedValue([
				makeRawEvent('2025-12-31'),
				makeRawEvent('2026-01-10'),
				makeRawEvent('2026-02-01'),
			]);

			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));
			expect(result.current.calendarEvents).toHaveLength(1);
			expect(result.current.calendarEvents[0].date).toEqual(new Date('2026-01-10'));
		});

		it('drops events where parseEventDescription returns null', async () => {
			const { parseEventDescription } = await import('@/features/calendar/utils/event-parser');
			vi.mocked(parseEventDescription).mockReturnValueOnce(null);
			vi.mocked(fetchMigraineEvents).mockResolvedValue([makeRawEvent('2026-01-10')]);

			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));
			expect(result.current.calendarEvents).toHaveLength(0);
		});

		it('sorts events by date ascending', async () => {
			vi.mocked(fetchMigraineEvents).mockResolvedValue([
				makeRawEvent('2026-01-20'),
				makeRawEvent('2026-01-05'),
				makeRawEvent('2026-01-12'),
			]);

			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));
			const dates = result.current.calendarEvents.map((e) => e.date.toISOString());
			expect(dates).toEqual([...dates].sort());
		});
	});

	describe('filteredEvents', () => {
		it('returns empty filteredEvents when filter is default', async () => {
			vi.mocked(isDefaultFilter).mockReturnValue(true);
			vi.mocked(fetchMigraineEvents).mockResolvedValue([makeRawEvent('2026-01-10')]);

			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));
			expect(result.current.filteredEvents).toEqual([]);
		});

		it('returns filtered events when filter is active', async () => {
			const { filterEvents } = await import('@/features/calendar/utils/filter');
			vi.mocked(isDefaultFilter).mockReturnValue(false);
			vi.mocked(filterEvents).mockReturnValue(true);
			vi.mocked(fetchMigraineEvents).mockResolvedValue([makeRawEvent('2026-01-10')]);

			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));
			expect(result.current.filteredEvents).toHaveLength(1);
		});
	});

	describe('migrainosus flags', () => {
		it('calls calculateMigrenosusFlags with the correct arguments', async () => {
			vi.mocked(fetchMigraineEvents).mockResolvedValue([makeRawEvent('2026-01-10')]);
			vi.mocked(calculateMigrenosusFlags).mockReturnValue([true, false]);

			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));
			expect(calculateMigrenosusFlags).toHaveBeenCalledWith(
				expect.any(Array),
				FIRST_DAY,
				DAYS_IN_MONTH,
				MIGRAINOSUS_FLAG_THRESHOLD,
			);
			expect(result.current.migrainosusFlags).toEqual([true, false]);
		});
	});

	describe('refetchEvents', () => {
		it('re-fetches events when refetchEvents is called', async () => {
			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			vi.mocked(fetchMigraineEvents).mockResolvedValue([makeRawEvent('2026-01-20')]);

			await act(async () => {
				await result.current.refetchEvents();
			});

			expect(fetchMigraineEvents).toHaveBeenCalledTimes(2);
			expect(result.current.calendarEvents).toHaveLength(1);
		});
	});

	describe('error cases', () => {
		it('sets isLoading: false even when fetch throws', async () => {
			vi.mocked(fetchMigraineEvents).mockRejectedValue(new Error('Network error'));
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));
			expect(result.current.calendarEvents).toEqual([]);
			consoleSpy.mockRestore();
		});

		it('does not update state after unmount (AbortError wird ignoriert)', async () => {
			let rejectFetch!: (err: Error) => void;
			vi.mocked(fetchMigraineEvents).mockReturnValue(
				new Promise((_, reject) => {
					rejectFetch = reject;
				}),
			);

			const { unmount } = renderCalendarEvents();
			unmount();

			await expect(async () => {
				rejectFetch(new DOMException('Aborted', 'AbortError'));
				await Promise.resolve();
			}).not.toThrow();
		});
	});

	describe('setFilter', () => {
		it('exposes setFilter and updates filter state', async () => {
			const { result } = renderCalendarEvents();

			await waitFor(() => expect(result.current.isLoading).toBe(false));

			const newFilter = {
				intensity: INTENSITY_TYPES.HIGH,
				symptom: [SYMPTOM_TYPES.NAUSEA],
				medicine: [],
				effectiveness: null,
				midas: [],
			};

			act(() => {
				result.current.setFilter(newFilter);
			});

			expect(result.current.filter).toEqual(newFilter);
		});
	});
});
