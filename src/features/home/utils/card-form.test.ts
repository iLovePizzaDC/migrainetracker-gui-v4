import { describe, expect, it } from 'vitest';
import { toCardFormState } from '@/features/home/utils/card-form';
import { CARD_TYPES, CHART_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/event/card';
import type { EventFilter } from '@/shared/types/event/event';

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
