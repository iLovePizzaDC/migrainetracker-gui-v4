import type { CARD_TYPES, CHART_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/event/card';

export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];

export type ChartType = (typeof CHART_TYPES)[keyof typeof CHART_TYPES];

export type TimeFrameUnit = (typeof TIME_FRAME_UNITS)[keyof typeof TIME_FRAME_UNITS];
