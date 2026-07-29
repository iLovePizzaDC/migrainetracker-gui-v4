import { CHART_TYPES } from '@/shared/constants/chart-cards/charts';
import type { CardType } from '@/shared/types/card';
import type { DropdownOption } from '@/shared/types/input';
import type { PieAmountFetcher, PieDataResult } from '@/features/chart-cards/types/card';
import { CARD_TYPES } from '@/shared/constants/chart-cards/cards';
import {
	fetchDurationAmount,
	fetchMedicineAmount,
	fetchMigraineAmount,
} from '@/shared/api/migraine.api';

export const CHART_OPTIONS: DropdownOption[] = [
	{ label: 'Area Chart', value: CHART_TYPES.AREA },
	{ label: 'Pie Chart', value: CHART_TYPES.PIE },
];

export const PIE_AMOUNT_FETCHERS: Partial<Record<CardType, PieAmountFetcher>> = {
	[CARD_TYPES.MIGRAINE]: fetchMigraineAmount,
	[CARD_TYPES.DURATION]: fetchDurationAmount,
	[CARD_TYPES.MEDICINE]: fetchMedicineAmount,
	[CARD_TYPES.MOH]: fetchMigraineAmount,
};

export const PIE_DATA_BUILDERS: Partial<
	Record<CardType, (value: number, totalDays: number) => PieDataResult>
> = {
	[CARD_TYPES.MIGRAINE]: (value, totalDays) => ({
		data: [
			{ name: 'Migraine', value },
			{ name: 'No Migraine', value: totalDays - value },
		],
		value,
	}),
	[CARD_TYPES.DURATION]: (value, totalDays) => ({
		data: [
			{ name: 'Migraine Duration', value },
			{ name: 'No Migraine', value: totalDays * 24 - value },
		],
		value,
	}),
	[CARD_TYPES.MEDICINE]: (value) => ({
		data: [{ name: 'Medicine', value }],
		value,
	}),
	[CARD_TYPES.MOH]: (value, totalDays) => ({
		data: [
			{ name: 'Med-Days', value },
			{ name: 'No Med-Days', value: Math.max(totalDays - value, 0) },
		],
		value,
	}),
};
