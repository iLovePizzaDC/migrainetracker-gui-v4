import type { CardFormDefaults, CardFormState } from '@/features/chart-cards/types/card';

export const toCardFormState = (defaults: CardFormDefaults): CardFormState => ({
	title: defaults.title,
	cardType: defaults.cardType,
	chartType: defaults.chartType,
	filter: defaults.filter,
	timeframe: { count: defaults.count, unit: defaults.unit },
});
