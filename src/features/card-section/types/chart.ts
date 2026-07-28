import type { CardType, ChartType, TimeFrameUnit } from '@/shared/types/cards/card';
import type { EventFilter } from '@/shared/types/event/event';

export type ChartData = {
	name: string;
	[key: string]: number | string;
}[];

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
