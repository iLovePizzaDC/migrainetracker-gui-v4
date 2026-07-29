import type { EventFilter } from '@/shared/types/event';
import type { ChartType } from '@/shared/types/chart';
import type { CardType, TimeFrameUnit } from '@/shared/types/card';
import type { Filter } from '@/shared/api/types/event';

export type CardSetup = {
	index: number;
	title: string;
	cardType: CardType;
	chartType: ChartType;
	filter: EventFilter;
	timeframe: {
		count: number;
		unit: TimeFrameUnit;
	};
};

export type CardFormDefaults = {
	title: string;
	cardType: CardType;
	chartType: ChartType;
	filter: EventFilter;
	count: number;
	unit: TimeFrameUnit;
};

export type CardFormState = Omit<CardSetup, 'index'>;

export type PieAmountFetcher = (
	startDate: string,
	endDate: string,
	filter: Filter,
) => Promise<number>;

export type PieDataResult = { data: { name: string; value: number }[]; value: number };
