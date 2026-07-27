import { describe, expect, it } from 'vitest';
import { getInitialFormState } from '@/features/calendar/utils/migraine-panel';
import { DEFAULT_DURATION, DEFAULT_MIDAS } from '@/features/calendar/constants/calendar';
import {
	INTENSITY_TYPES,
	MIDAS_TYPES,
	SYMPTOM_TYPES,
} from '@/shared/constants/event/event-details';
import type { Entry } from '@/features/calendar/types/calendar';

const mockMedicines = [
	{
		medicine: {
			abbreviation: 'tst_med',
			label: 'test medicine',
		},
		taken: 2,
		effectiveness: 1,
	},
];

const mockMidas = {
	[MIDAS_TYPES.WORK_MISSED]: true,
	[MIDAS_TYPES.WORK_IMPAIRED]: false,
	[MIDAS_TYPES.CHORES_MISSED]: false,
	[MIDAS_TYPES.CHORES_IMPAIRED]: false,
	[MIDAS_TYPES.SOCIAL_MISSED]: false,
};

describe('getInitialFormState', () => {
	it('returns the default form state when no entry is prefilled', () => {
		const result = getInitialFormState();

		expect(result).toEqual({
			durations: [DEFAULT_DURATION],
			intensity: INTENSITY_TYPES.MEDIUM,
			symptoms: [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT],
			medicines: [],
			midas: DEFAULT_MIDAS,
		});
	});

	it('returns the default form state when prefilled is null', () => {
		const result = getInitialFormState(null);

		expect(result).toEqual({
			durations: [DEFAULT_DURATION],
			intensity: INTENSITY_TYPES.MEDIUM,
			symptoms: [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT],
			medicines: [],
			midas: DEFAULT_MIDAS,
		});
	});

	it('returns the values from the prefilled entry', () => {
		const prefilled: Entry = {
			durations: [
				{
					id: 0,
					startTime: '10:00',
					endTime: '12:00',
				},
			],
			intensity: INTENSITY_TYPES.HIGH,
			symptoms: [SYMPTOM_TYPES.NOISE],
			medicines: mockMedicines,
			midas: mockMidas,
		};

		const result = getInitialFormState(prefilled);

		expect(result).toEqual({
			durations: prefilled.durations,
			intensity: prefilled.intensity,
			symptoms: prefilled.symptoms,
			medicines: prefilled.medicines,
			midas: prefilled.midas,
		});
	});

	it('does not use default values when a prefilled entry is provided', () => {
		const prefilled: Entry = {
			durations: [],
			intensity: INTENSITY_TYPES.LOW,
			symptoms: [],
			medicines: [],
			midas: DEFAULT_MIDAS,
		};

		const result = getInitialFormState(prefilled);

		expect(result).toEqual(prefilled);
	});
});
