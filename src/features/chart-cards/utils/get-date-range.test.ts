import { getDateRange } from '@/features/chart-cards/utils/get-date-range';
import { TIME_FRAME_UNITS } from '@/shared/constants/chart-cards/cards';
import {
	formatDateToUs,
	getDateBeforeDays,
	getDateBeforeMonths,
	getDayDifference,
} from '@/shared/utils/date';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/utils/date/date');

describe('getDateRange', () => {
	beforeEach(() => {
		vi.mocked(getDateBeforeDays).mockReturnValue(new Date('2026-01-01'));
		vi.mocked(getDateBeforeMonths).mockReturnValue(new Date('2026-01-01'));
		vi.mocked(formatDateToUs).mockReturnValue('2026-01-01');
		vi.mocked(getDayDifference).mockReturnValue(30);
	});

	afterEach(() => vi.clearAllMocks());

	describe('days', () => {
		it('uses getDateBeforeDays for start and end when unit is DAYS', () => {
			getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(getDateBeforeDays).toHaveBeenCalledTimes(2);
			expect(getDateBeforeMonths).not.toHaveBeenCalled();
		});

		it('calls getDateBeforeDays with count for start', () => {
			getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(getDateBeforeDays).toHaveBeenCalledWith(expect.any(Date), 30);
		});

		it('calls getDateBeforeDays with 1 for end', () => {
			getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(getDateBeforeDays).toHaveBeenCalledWith(expect.any(Date), 1);
		});
	});

	describe('months', () => {
		it('uses getDateBeforeMonths for start and end when unit is MONTHS', () => {
			getDateRange(3, TIME_FRAME_UNITS.MONTHS);

			expect(getDateBeforeMonths).toHaveBeenCalledTimes(2);
			expect(getDateBeforeDays).not.toHaveBeenCalled();
		});

		it('calls getDateBeforeMonths with count for start', () => {
			getDateRange(3, TIME_FRAME_UNITS.MONTHS);

			expect(getDateBeforeMonths).toHaveBeenCalledWith(expect.any(Date), 3);
		});

		it('calls getDateBeforeMonths with 1 for end', () => {
			getDateRange(3, TIME_FRAME_UNITS.MONTHS);

			expect(getDateBeforeMonths).toHaveBeenCalledWith(expect.any(Date), 1);
		});
	});

	describe('return value', () => {
		it('returns startDate and endDate from formatDateToUs', () => {
			vi.mocked(formatDateToUs).mockReturnValueOnce('2025-12-01').mockReturnValueOnce('2025-12-31');

			const result = getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(result.startDate).toBe('2025-12-01');
			expect(result.endDate).toBe('2025-12-31');
		});

		it('returns totalDays from getDayDifference', () => {
			vi.mocked(getDayDifference).mockReturnValue(42);

			const result = getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(result.totalDays).toBe(42);
		});

		it('calls getDayDifference with parsed startDate and endDate', () => {
			vi.mocked(formatDateToUs).mockReturnValueOnce('2025-12-01').mockReturnValueOnce('2025-12-31');

			getDateRange(30, TIME_FRAME_UNITS.DAYS);

			expect(getDayDifference).toHaveBeenCalledWith(new Date('2025-12-01'), new Date('2025-12-31'));
		});
	});
});
