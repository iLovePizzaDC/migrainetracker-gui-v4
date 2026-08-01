import type { CARD_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/chart-cards/cards';

export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];

export type TimeFrameUnit = (typeof TIME_FRAME_UNITS)[keyof typeof TIME_FRAME_UNITS];
