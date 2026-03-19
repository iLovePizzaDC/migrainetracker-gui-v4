import { getDateRange } from '@/features/home/utils/get-date-range';
import { TIME_FRAME_UNITS } from '@/shared/constants/event/card';
import * as dateUtils from '@/shared/utils/date/date';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/date/date');

describe('getDateRange', () => {
	beforeEach(() => {
		vi.mocked(dateUtils.getDateBeforeDays).mockReturnValue(new Date('2026-01-01'));
		vi.mocked(dateUtils.getDateBeforeMonths).mockReturnValue(new Date('2026-01-01'));
		vi.mocked(dateUtils.formatDateToUs).mockReturnValue('2026-01-01');
		vi.mocked(dateUtils.getDayDifference).mockReturnValue(30);
	});

	afterEach(() => vi.clearAllMocks());

	describe('days', () => {
		it('uses getDateBeforeDays for start and end when unit is DAYS', () => {
			getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(dateUtils.getDateBeforeDays).toHaveBeenCalledTimes(2);
			expect(dateUtils.getDateBeforeMonths).not.toHaveBeenCalled();
		});

		it('calls getDateBeforeDays with count for start', () => {
			getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(dateUtils.getDateBeforeDays).toHaveBeenCalledWith(expect.any(Date), 30);
		});

		it('calls getDateBeforeDays with 1 for end', () => {
			getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(dateUtils.getDateBeforeDays).toHaveBeenCalledWith(expect.any(Date), 1);
		});
	});

	describe('months', () => {
		it('uses getDateBeforeMonths for start and end when unit is MONTHS', () => {
			getDateRange(3, TIME_FRAME_UNITS.MONTHS);

			expect(dateUtils.getDateBeforeMonths).toHaveBeenCalledTimes(2);
			expect(dateUtils.getDateBeforeDays).not.toHaveBeenCalled();
		});

		it('calls getDateBeforeMonths with count for start', () => {
			getDateRange(3, TIME_FRAME_UNITS.MONTHS);

			expect(dateUtils.getDateBeforeMonths).toHaveBeenCalledWith(expect.any(Date), 3);
		});

		it('calls getDateBeforeMonths with 1 for end', () => {
			getDateRange(3, TIME_FRAME_UNITS.MONTHS);

			expect(dateUtils.getDateBeforeMonths).toHaveBeenCalledWith(expect.any(Date), 1);
		});
	});

	describe('return value', () => {
		it('returns startDate and endDate from formatDateToUs', () => {
			vi.mocked(dateUtils.formatDateToUs)
				.mockReturnValueOnce('2025-12-01')
				.mockReturnValueOnce('2025-12-31');

			const result = getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(result.startDate).toBe('2025-12-01');
			expect(result.endDate).toBe('2025-12-31');
		});

		it('returns totalDays from getDayDifference', () => {
			vi.mocked(dateUtils.getDayDifference).mockReturnValue(42);

			const result = getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(result.totalDays).toBe(42);
		});

		it('calls getDayDifference with parsed startDate and endDate', () => {
			vi.mocked(dateUtils.formatDateToUs)
				.mockReturnValueOnce('2025-12-01')
				.mockReturnValueOnce('2025-12-31');

			getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(dateUtils.getDayDifference).toHaveBeenCalledWith(
				new Date('2025-12-01'),
				new Date('2025-12-31'),
			);
		});
	});
});
