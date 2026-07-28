import { describe, expect, it } from 'vitest';
import { toCardFormState } from '@/features/card-section/utils/card-form';
import { TIME_FRAME_UNITS } from '@/shared/constants/event/card';
import type { EventFilter } from '@/shared/types/event';
import { CARD_TYPES, CHART_TYPES } from '../constants/card';

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
