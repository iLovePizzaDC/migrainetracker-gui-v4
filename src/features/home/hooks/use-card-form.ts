import { useState, type Dispatch, type SetStateAction } from 'react';
import type { CardFormDefaults, CardFormState, CardSetup } from '@/features/home/types/chart';
import type { CardType, ChartType, TimeFrameUnit } from '@/shared/types/cards/card';
import type { EventFilter } from '@/shared/types/event/event';

const toState = (defaults: CardFormDefaults): CardFormState => ({
	title: defaults.title,
	cardType: defaults.cardType,
	chartType: defaults.chartType,
	filter: defaults.filter,
	timeframe: { count: defaults.count, unit: defaults.unit },
});

export function useCardForm(defaults: CardFormDefaults) {
	const [form, setForm] = useState<CardFormState>(() => toState(defaults));

	const setTitle = (title: string) => setForm((prev) => ({ ...prev, title }));
	const setCardType = (cardType: CardType) => setForm((prev) => ({ ...prev, cardType }));
	const setChartType = (chartType: ChartType) => setForm((prev) => ({ ...prev, chartType }));
	const setCount = (count: number) =>
		setForm((prev) => ({ ...prev, timeframe: { ...prev.timeframe, count } }));
	const setUnit = (unit: TimeFrameUnit) =>
		setForm((prev) => ({ ...prev, timeframe: { ...prev.timeframe, unit } }));

	const setFilter: Dispatch<SetStateAction<EventFilter>> = (value) =>
		setForm((prev) => ({
			...prev,
			filter:
				typeof value === 'function'
					? (value as (prev: EventFilter) => EventFilter)(prev.filter)
					: value,
		}));

	const reset = () => setForm(toState(defaults));
	const buildSetup = (index: number): CardSetup => ({ index, ...form });

	return {
		form,
		setTitle,
		setCardType,
		setChartType,
		setCount,
		setUnit,
		setFilter,
		reset,
		buildSetup,
	};
}
