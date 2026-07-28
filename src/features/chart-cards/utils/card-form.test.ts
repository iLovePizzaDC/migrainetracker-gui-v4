import { describe, expect, it } from 'vitest';
import { toCardFormState } from '@/features/chart-cards/utils/card-form';
import type { EventFilter } from '@/shared/types/event';
import { CARD_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/chart-cards/cards';
import { CHART_TYPES } from '@/shared/constants/chart-cards/charts';

const defaultFilter: EventFilter = {
	intensity: null,
	symptom: [],
	medicine: [],
	effectiveness: null,
	midas: [],
};

describe('toCardFormState', () => {
	it('maps flat defaults to nested CardFormState', () => {
		const result = toCardFormState({
			title: 'Default title',
			cardType: CARD_TYPES.MIGRAINE,
			chartType: CHART_TYPES.AREA,
			filter: defaultFilter,
			count: 12,
			unit: TIME_FRAME_UNITS.MONTHS,
		});

		expect(result).toEqual({
			title: 'Default title',
			cardType: CARD_TYPES.MIGRAINE,
			chartType: CHART_TYPES.AREA,
			filter: defaultFilter,
			timeframe: { count: 12, unit: TIME_FRAME_UNITS.MONTHS },
		});
	});
});
