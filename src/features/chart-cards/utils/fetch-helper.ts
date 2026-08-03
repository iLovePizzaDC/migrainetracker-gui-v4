import { MAX_MIDAS_SCORE } from '@/features/chart-cards/constants/midas';
import { fetchAreaChart, fetchMidasScore } from '@/shared/api/migraine.api';
import type { Filter } from '@/shared/api/types/event';
import { CARD_TYPES } from '@/shared/constants/chart-cards/cards';
import {
	ANY_FILTER_OPTIONS,
	ANY_FILTER_TYPE,
	SYMPTOM_OPTIONS,
} from '@/shared/constants/event/event-details';
import type { CardType, TimeFrameUnit } from '@/shared/types/card';
import type { EventFilter } from '@/shared/types/event';
import type { Medicine } from '@/shared/types/medicine';
import { formatDateToUs } from '@/shared/utils/date';
import { getMohMedicineFilter } from '@/shared/utils/fetch-helper';
import type {
	MidasComparison,
	MidasPieData,
	PieDataResult,
} from '@/features/chart-cards/types/card';
import { PIE_AMOUNT_FETCHERS, PIE_DATA_BUILDERS } from '@/features/chart-cards/constants/chart';

const mapMedicines = (filter: EventFilter, userMedicines: Medicine[]): string | undefined => {
	if (filter.medicine.length === 0) return undefined;

	const hasAny = filter.medicine.some(
		(medicine) => medicine.abbreviation === ANY_FILTER_OPTIONS.value,
	);

	return (hasAny ? userMedicines : filter.medicine)
		.map((medicine) => medicine.abbreviation)
		.join(',');
};

const mapSymptoms = (filter: EventFilter): string | undefined => {
	if (filter.symptom.length === 0) return undefined;

	return filter.symptom.includes(ANY_FILTER_TYPE.ANY)
		? SYMPTOM_OPTIONS.map((symptomOption) => symptomOption.value).join(',')
		: filter.symptom.join(',');
};

const mapEventFilterToFilter = async (
	userMedicines: Medicine[],
	filter: EventFilter,
	isMoh: boolean = false,
): Promise<Filter> => ({
	intensity: filter.intensity ?? undefined,
	symptoms: mapSymptoms(filter),
	medicines: isMoh
		? await getMohMedicineFilter(userMedicines)
		: mapMedicines(filter, userMedicines),
	effectiveness: filter.effectiveness ?? undefined,
});

// TODO also add midas only for area charts which displays the score over the months
export async function fetchAreaData(
	cardType: CardType,
	endDate: string,
	count: number,
	unit: TimeFrameUnit,
	filter: EventFilter,
	userMedicines: Medicine[],
) {
	const isMoh = cardType === CARD_TYPES.MOH;

	return await fetchAreaChart(
		cardType,
		endDate,
		count,
		unit,
		await mapEventFilterToFilter(userMedicines, filter, isMoh),
	);
}

export async function fetchPieData(
	cardType: CardType,
	startDate: string,
	endDate: string,
	totalDays: number,
	filter: EventFilter,
	userMedicines: Medicine[],
): Promise<PieDataResult> {
	const fetchAmount = PIE_AMOUNT_FETCHERS[cardType];
	const buildPieData = PIE_DATA_BUILDERS[cardType];

	if (!fetchAmount || !buildPieData) {
		return { data: [], value: 0 };
	}

	const isMoh = cardType === CARD_TYPES.MOH;
	const value = await fetchAmount(
		startDate,
		endDate,
		await mapEventFilterToFilter(userMedicines, filter, isMoh),
	);

	return buildPieData(value, totalDays);
}

const buildMidasPieData = (score: number, label: string): MidasPieData[] => [
	{ name: label, value: score },
	{ name: 'Remaining', value: MAX_MIDAS_SCORE - score },
];

export async function fetchMidasPieData(): Promise<MidasComparison> {
	const previousMonth = new Date();
	previousMonth.setMonth(previousMonth.getMonth() - 1);

	const twoMonthsAgo = new Date();
	twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

	const [currentScore, previousScore] = await Promise.all([
		fetchMidasScore(formatDateToUs(previousMonth)),
		fetchMidasScore(formatDateToUs(twoMonthsAgo)),
	]);

	return {
		current: { score: currentScore, pieData: buildMidasPieData(currentScore, 'Current Score') },
		previous: {
			score: previousScore,
			pieData: buildMidasPieData(previousScore, 'Previous Score'),
		},
	};
}
