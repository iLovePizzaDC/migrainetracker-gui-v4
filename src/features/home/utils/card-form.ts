import type { CardFormDefaults, CardFormState } from '@/features/home/types/chart';

export const toCardFormState = (defaults: CardFormDefaults): CardFormState => ({
	title: defaults.title,
	cardType: defaults.cardType,
	chartType: defaults.chartType,
	filter: defaults.filter,
	timeframe: { count: defaults.count, unit: defaults.unit },
});
