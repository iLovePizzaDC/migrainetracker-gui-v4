import { useState, type Dispatch, type SetStateAction } from 'react';
import type {
	CardFormDefaults,
	CardFormState,
	CardSetup,
} from '@/features/card-section/types/chart';
import type { CardType, ChartType, TimeFrameUnit } from '@/shared/types/cards/card';
import type { EventFilter } from '@/shared/types/event/event';
import { toCardFormState } from '@/features/card-section/utils/card-form';

export function useCardForm(defaults: CardFormDefaults) {
	const [form, setForm] = useState<CardFormState>(() => toCardFormState(defaults));

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

	const reset = () => setForm(toCardFormState(defaults));
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
