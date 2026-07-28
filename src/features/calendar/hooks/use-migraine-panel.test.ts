import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { fetchNewEntry } from '@/shared/api/migraine.api';
import { formatDateToUs } from '@/shared/utils/date';
import { getInitialFormState } from '@/features/calendar/utils/migraine-panel';
import { FEEDBACK_TYPES } from '@/shared/constants/button/feedback';
import type { Entry } from '@/features/calendar/types/calendar';
import { useMigrainePanel } from '@/features/calendar/hooks/use-migraine-panel';
import { INTENSITY_TYPES } from '@/shared/constants/event/event-details';
import { ENTRY_STORAGE_KEY } from '@/features/calendar/constants/calendar';

vi.mock('@/features/calendar/hooks/use-calendar');
vi.mock('@/shared/api/migraine.api');
vi.mock('@/shared/utils/date');
vi.mock('@/features/calendar/utils/migraine-panel');

const emptyForm: Entry = {
	durations: [],
	intensity: 0,
	symptoms: [],
	medicines: [],
	midas: 0,
} as unknown as Entry;

const prefilledEntry: Entry = {
	durations: ['08:00-10:00'],
	intensity: 5,
	symptoms: ['nausea'],
	medicines: ['ibuprofen'],
	midas: 2,
} as unknown as Entry;

describe('useMigrainePanel', () => {
	const testDate = new Date('2026-07-27T00:00:00Z');
	const onClose = vi.fn();
	const refetchEvents = vi.fn().mockResolvedValue(undefined);

	beforeEach(() => {
		vi.clearAllMocks();

		vi.mocked(useCalendar).mockReturnValue({ refetchEvents } as any);
		vi.mocked(formatDateToUs).mockReturnValue('07/27/2026');
		vi.mocked(getInitialFormState).mockImplementation(
			(prefilled) => (prefilled ?? emptyForm) as Entry,
		);
	});

	describe('initial state', () => {
		it('initializes the form via getInitialFormState', () => {
			const { result } = renderHook(() =>
				useMigrainePanel(testDate, onClose, false, prefilledEntry),
			);

			expect(getInitialFormState).toHaveBeenCalledWith(prefilledEntry);
			expect(result.current.form).toEqual(prefilledEntry);
		});

		it('initializes areInputsDisabled from the disabled prop', () => {
			const { result } = renderHook(() => useMigrainePanel(testDate, onClose, true, null));

			expect(result.current.areInputsDisabled).toBe(true);
		});

		it('starts with neutral feedback and loading state', () => {
			const { result } = renderHook(() => useMigrainePanel(testDate, onClose, false, null));

			expect(result.current.cacheFeedback).toBe(FEEDBACK_TYPES.NULL);
			expect(result.current.saveFeedback).toBe(FEEDBACK_TYPES.NULL);
			expect(result.current.isLoading).toBe(false);
		});
	});

	describe('reset effect', () => {
		it('resets form and feedback when date, disabled, or prefilled change', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			vi.mocked(fetchNewEntry).mockRejectedValue(new Error('fail'));

			const { result, rerender } = renderHook(
				({ date, disabled, prefilled }) => useMigrainePanel(date, onClose, disabled, prefilled),
				{
					initialProps: {
						date: testDate,
						disabled: false,
						prefilled: null as Entry | null,
					},
				},
			);

			await act(async () => {
				await result.current.submitNewEntry();
			});
			act(() => {
				result.current.setAreInputsDisabled(true);
			});

			expect(result.current.saveFeedback).toBe(FEEDBACK_TYPES.ERROR);
			expect(result.current.areInputsDisabled).toBe(true);

			rerender({
				date: new Date('2026-07-28T00:00:00Z'),
				disabled: false,
				prefilled: null,
			});

			expect(result.current.saveFeedback).toBe(FEEDBACK_TYPES.NULL);
			expect(result.current.cacheFeedback).toBe(FEEDBACK_TYPES.NULL);
			expect(result.current.areInputsDisabled).toBe(false);
			expect(getInitialFormState).toHaveBeenLastCalledWith(null);

			consoleErrorSpy.mockRestore();
		});
	});

	describe('showMedicine', () => {
		it('is true when there is no prefilled entry', () => {
			const { result } = renderHook(() => useMigrainePanel(testDate, onClose, true, null));

			expect(result.current.showMedicine).toBe(true);
		});

		it('is true when inputs are not disabled, regardless of medicines', () => {
			const { result } = renderHook(() =>
				useMigrainePanel(testDate, onClose, false, {
					...prefilledEntry,
					medicines: [],
				} as Entry),
			);

			expect(result.current.showMedicine).toBe(true);
		});

		it('is false when prefilled, disabled, and no medicines are set', () => {
			const entry = { ...prefilledEntry, medicines: [] } as Entry;

			const { result } = renderHook(() => useMigrainePanel(testDate, onClose, true, entry));

			expect(result.current.showMedicine).toBe(false);
		});

		it('is true when prefilled and disabled, but medicines exist', () => {
			const { result } = renderHook(() =>
				useMigrainePanel(testDate, onClose, true, prefilledEntry),
			);

			expect(result.current.showMedicine).toBe(true);
		});
	});

	describe('updateForm', () => {
		it('updates only the given field', () => {
			const { result } = renderHook(() => useMigrainePanel(testDate, onClose, false, null));

			act(() => {
				result.current.updateForm('intensity', INTENSITY_TYPES.HIGH);
			});

			expect(result.current.form).toEqual({ ...emptyForm, intensity: INTENSITY_TYPES.HIGH });
		});
	});

	describe('submitNewEntry', () => {
		it('saves the entry, refetches events, and closes the panel on success', async () => {
			vi.mocked(fetchNewEntry).mockResolvedValue(undefined as any);

			const { result } = renderHook(() =>
				useMigrainePanel(testDate, onClose, false, prefilledEntry),
			);

			await act(async () => {
				await result.current.submitNewEntry();
			});

			expect(formatDateToUs).toHaveBeenCalledWith(testDate);
			expect(fetchNewEntry).toHaveBeenCalledWith(
				'07/27/2026',
				prefilledEntry.durations,
				prefilledEntry.intensity,
				prefilledEntry.symptoms,
				prefilledEntry.medicines,
				prefilledEntry.midas,
			);
			expect(result.current.saveFeedback).toBe(FEEDBACK_TYPES.SUCCESS);
			expect(refetchEvents).toHaveBeenCalledTimes(1);
			expect(onClose).toHaveBeenCalledTimes(1);
			expect(result.current.isLoading).toBe(false);
		});

		it('sets error feedback and does not close the panel on failure', async () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			vi.mocked(fetchNewEntry).mockRejectedValue(new Error('network error'));

			const { result } = renderHook(() =>
				useMigrainePanel(testDate, onClose, false, prefilledEntry),
			);

			await act(async () => {
				await result.current.submitNewEntry();
			});

			expect(result.current.saveFeedback).toBe(FEEDBACK_TYPES.ERROR);
			expect(refetchEvents).not.toHaveBeenCalled();
			expect(onClose).not.toHaveBeenCalled();
			expect(result.current.isLoading).toBe(false);
			expect(consoleErrorSpy).toHaveBeenCalled();

			consoleErrorSpy.mockRestore();
		});
	});

	describe('saveNewEntry', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('caches the entry in localStorage and closes after 500ms on success', () => {
			const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

			const { result } = renderHook(() =>
				useMigrainePanel(testDate, onClose, false, prefilledEntry),
			);

			act(() => {
				result.current.saveNewEntry();
			});

			expect(setItemSpy).toHaveBeenCalledWith(
				ENTRY_STORAGE_KEY,
				JSON.stringify({ date: testDate, ...prefilledEntry }),
			);
			expect(result.current.cacheFeedback).toBe(FEEDBACK_TYPES.SUCCESS);
			expect(onClose).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(500);
			});

			expect(onClose).toHaveBeenCalledTimes(1);
			setItemSpy.mockRestore();
		});

		it('sets error feedback when localStorage.setItem throws', () => {
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
			const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
				throw new Error('quota exceeded');
			});

			const { result } = renderHook(() =>
				useMigrainePanel(testDate, onClose, false, prefilledEntry),
			);

			act(() => {
				result.current.saveNewEntry();
			});

			expect(result.current.cacheFeedback).toBe(FEEDBACK_TYPES.ERROR);
			expect(onClose).not.toHaveBeenCalled();
			expect(consoleErrorSpy).toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(500);
			});
			expect(onClose).not.toHaveBeenCalled();

			setItemSpy.mockRestore();
			consoleErrorSpy.mockRestore();
		});
	});
});
