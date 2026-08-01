import type { CHART_TYPES } from '@/shared/constants/chart-cards/charts';

export type ChartData = {
	name: string;
	[key: string]: number | string;
}[];

export type ChartType = (typeof CHART_TYPES)[keyof typeof CHART_TYPES];
