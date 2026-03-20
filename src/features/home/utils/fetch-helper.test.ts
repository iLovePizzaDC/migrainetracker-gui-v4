import { MAX_MIDAS_SCORE } from '@/features/home/constants/midas';
import { fetchAreaData, fetchMidasPieData, fetchPieData } from '@/features/home/utils/fetch-helper';
import * as migraineApi from '@/shared/api/migraine.api';
import type { RawAreaChartResponse } from '@/shared/api/types/migraine';
import { CARD_TYPES, CHART_TYPES } from '@/shared/constants/event/card';
import {
	ANY_FILTER_OPTIONS,
	ANY_FILTER_TYPE,
	SYMPTOM_OPTIONS,
} from '@/shared/constants/event/event-details';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import * as fetchHelperUtil from '@/shared/utils/fetch-helper';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/migraine.api');
vi.mock('@/shared/utils/fetch-helper');
vi.mock('@/shared/utils/date/date', () => ({
	formatDateToUs: vi.fn((d: Date) => d.toISOString().split('T')[0]),
}));

const mockFilter = {
	intensity: null,
	symptom: [],
	medicine: [],
	effectiveness: null,
	midas: [],
};

const mockMedicines = [
	{ name: 'Med A', abbreviation: 'med_a', type: MEDICINE_TYPES.PAINKILLER },
	{ name: 'Med B', abbreviation: 'med_b', type: MEDICINE_TYPES.MIGRAINE_PAINKILLER },
];

describe('fetchAreaData', () => {
	beforeEach(() => {
		vi.mocked(migraineApi.fetchAreaChart).mockResolvedValue({
			dataPoints: [],
			labels: [],
			type: CHART_TYPES.AREA,
		} as RawAreaChartResponse);
		vi.mocked(fetchHelperUtil.getMohMedicineFilter).mockResolvedValue('med_a,med_b');
	});

	afterEach(() => vi.clearAllMocks());

	it('calls fetchAreaChart with mapped filter', async () => {
		await fetchAreaData(CARD_TYPES.MIGRAINE, '2026-01-31', 30, 'DAYS', mockFilter, []);

		expect(migraineApi.fetchAreaChart).toHaveBeenCalledWith(
			CARD_TYPES.MIGRAINE,
			'2026-01-31',
			30,
			'DAYS',
			expect.objectContaining({ intensity: undefined }),
		);
	});

	it('uses MOH medicine filter for MOH card type', async () => {
		await fetchAreaData(CARD_TYPES.MOH, '2026-01-31', 30, 'DAYS', mockFilter, mockMedicines);

		expect(fetchHelperUtil.getMohMedicineFilter).toHaveBeenCalled();
		expect(migraineApi.fetchAreaChart).toHaveBeenCalledWith(
			CARD_TYPES.MOH,
			'2026-01-31',
			30,
			'DAYS',
			expect.objectContaining({ medicines: 'med_a,med_b' }),
		);
	});

	it('does not use MOH filter for non-MOH card type', async () => {
		await fetchAreaData(CARD_TYPES.MIGRAINE, '2026-01-31', 30, 'DAYS', mockFilter, mockMedicines);

		expect(fetchHelperUtil.getMohMedicineFilter).not.toHaveBeenCalled();
	});

	it('maps intensity filter correctly', async () => {
		const filter = { ...mockFilter, intensity: 'high' as any };

		await fetchAreaData(CARD_TYPES.MIGRAINE, '2026-01-31', 30, 'DAYS', filter, []);

		expect(migraineApi.fetchAreaChart).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ intensity: 'high' }),
		);
	});

	it('maps specific medicines from filter', async () => {
		const filter = { ...mockFilter, medicine: [{ abbreviation: 'med_a', label: 'Med A' }] };

		await fetchAreaData(CARD_TYPES.MIGRAINE, '2026-01-31', 30, 'DAYS', filter, mockMedicines);

		expect(migraineApi.fetchAreaChart).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ medicines: 'med_a' }),
		);
	});

	it('maps ALL user medicines when medicine filter contains ANY', async () => {
		const filter = {
			...mockFilter,
			medicine: [{ abbreviation: ANY_FILTER_OPTIONS.value, label: 'Any' }],
		};

		await fetchAreaData(CARD_TYPES.MIGRAINE, '2026-01-31', 30, 'DAYS', filter, mockMedicines);

		expect(migraineApi.fetchAreaChart).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ medicines: 'med_a,med_b' }),
		);
	});

	it('maps specific symptoms from filter', async () => {
		const filter = { ...mockFilter, symptom: ['noi'] as any };

		await fetchAreaData(CARD_TYPES.MIGRAINE, '2026-01-31', 30, 'DAYS', filter, []);

		expect(migraineApi.fetchAreaChart).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ symptoms: 'noi' }),
		);
	});

	it('maps ALL symptoms when symptom filter contains ANY', async () => {
		const filter = { ...mockFilter, symptom: [ANY_FILTER_TYPE.ANY] as any };

		await fetchAreaData(CARD_TYPES.MIGRAINE, '2026-01-31', 30, 'DAYS', filter, []);

		const allSymptoms = SYMPTOM_OPTIONS.map((s) => s.value).join(',');
		expect(migraineApi.fetchAreaChart).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ symptoms: allSymptoms }),
		);
	});
});

describe('fetchPieData', () => {
	beforeEach(() => {
		vi.mocked(migraineApi.fetchMigraineAmount).mockResolvedValue(5);
		vi.mocked(migraineApi.fetchDurationAmount).mockResolvedValue(10);
		vi.mocked(migraineApi.fetchMedicineAmount).mockResolvedValue(3);
		vi.mocked(fetchHelperUtil.getMohMedicineFilter).mockResolvedValue('med_a');
	});

	afterEach(() => vi.clearAllMocks());

	describe('migraine', () => {
		it('returns migraine pie data with correct values', async () => {
			const result = await fetchPieData(
				CARD_TYPES.MIGRAINE,
				'2026-01-01',
				'2026-01-31',
				31,
				mockFilter,
				[],
			);

			expect(result.value).toBe(5);
			expect(result.data).toEqual([
				{ name: 'Migraine', value: 5 },
				{ name: 'No Migraine', value: 26 },
			]);
		});
	});

	describe('durations', () => {
		it('returns duration pie data with correct values', async () => {
			const result = await fetchPieData(
				CARD_TYPES.DURATION,
				'2026-01-01',
				'2026-01-31',
				31,
				mockFilter,
				[],
			);

			expect(result.value).toBe(10);
			expect(result.data).toEqual([
				{ name: 'Migraine Duration', value: 10 },
				{ name: 'No Migraine', value: 31 * 24 - 10 },
			]);
		});
	});

	describe('medicine', () => {
		it('returns medicine pie data with correct values', async () => {
			const result = await fetchPieData(
				CARD_TYPES.MEDICINE,
				'2026-01-01',
				'2026-01-31',
				31,
				mockFilter,
				[],
			);

			expect(result.value).toBe(3);
			expect(result.data).toEqual([
				{ name: 'Medicine', value: 3 },
				{ name: 'No Medicine', value: 28 },
			]);
		});

		it('clamps No Medicine to 0 when medicine days exceed totalDays', async () => {
			vi.mocked(migraineApi.fetchMedicineAmount).mockResolvedValue(50);

			const result = await fetchPieData(
				CARD_TYPES.MEDICINE,
				'2026-01-01',
				'2026-01-31',
				31,
				mockFilter,
				[],
			);

			expect(result.data[1].value).toBe(0);
		});
	});

	describe('moh', () => {
		it('returns MOH pie data using MOH medicine filter', async () => {
			const result = await fetchPieData(
				CARD_TYPES.MOH,
				'2026-01-01',
				'2026-01-31',
				31,
				mockFilter,
				[],
			);

			expect(fetchHelperUtil.getMohMedicineFilter).toHaveBeenCalled();
			expect(result.value).toBe(5);
			expect(result.data).toEqual([
				{ name: 'Med-Days', value: 5 },
				{ name: 'No Med-Days', value: 26 },
			]);
		});

		it('clamps No Med-Days to 0 when medDays exceed totalDays', async () => {
			vi.mocked(migraineApi.fetchMigraineAmount).mockResolvedValue(50);

			const result = await fetchPieData(
				CARD_TYPES.MOH,
				'2026-01-01',
				'2026-01-31',
				31,
				mockFilter,
				[],
			);

			expect(result.data[1].value).toBe(0);
		});
	});

	describe('default', () => {
		it('returns empty data for unknown card type', async () => {
			const result = await fetchPieData(
				'UNKNOWN' as any,
				'2026-01-01',
				'2026-01-31',
				31,
				mockFilter,
				[],
			);

			expect(result).toEqual({ data: [], value: 0 });
		});
	});
});

describe('fetchMidasPieData', () => {
	beforeEach(() => {
		vi.mocked(migraineApi.fetchMidasScore).mockResolvedValue(12);
	});

	afterEach(() => vi.clearAllMocks());

	it('calls fetchMidasScore twice', async () => {
		await fetchMidasPieData();
		expect(migraineApi.fetchMidasScore).toHaveBeenCalledTimes(2);
	});

	it('returns current and previous score', async () => {
		vi.mocked(migraineApi.fetchMidasScore).mockResolvedValueOnce(12).mockResolvedValueOnce(8);

		const result = await fetchMidasPieData();

		expect(result.current.score).toBe(12);
		expect(result.previous.score).toBe(8);
	});

	it('calculates remaining correctly against MAX_MIDAS_SCORE', async () => {
		vi.mocked(migraineApi.fetchMidasScore).mockResolvedValue(10);

		const result = await fetchMidasPieData();

		expect(result.current.pieData).toEqual([
			{ name: 'Current Score', value: 10 },
			{ name: 'Remaining', value: MAX_MIDAS_SCORE - 10 },
		]);
		expect(result.previous.pieData).toEqual([
			{ name: 'Previous Score', value: 10 },
			{ name: 'Remaining', value: MAX_MIDAS_SCORE - 10 },
		]);
	});
});
