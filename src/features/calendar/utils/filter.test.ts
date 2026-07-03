import type { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import type { Event } from '@/features/calendar/types/event';
import { filterEvents, isDefaultFilter } from '@/features/calendar/utils/filter';
import {
	ANY_FILTER_TYPE,
	ANY_INPUT_FILTER_OPTION,
	EFFECTIVENESS_TYPES,
	INTENSITY_TYPES,
	MIDAS_TYPES,
	SYMPTOM_TYPES,
} from '@/shared/constants/event/event-details';
import { describe, expect, it } from 'vitest';

const makeEvent = (overrides: Partial<Event['description']> = {}): Event => ({
	date: new Date('2026-01-01'),
	strength: 200 as keyof typeof STRENGTH_MAP,
	description: {
		duration: [],
		intensity: INTENSITY_TYPES.HIGH,
		symptoms: [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT],
		medicine: 'med_a,med_b',
		effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE],
		midas: {
			workMissed: true,
			workImpaired: false,
			choresMissed: false,
			choresImpaired: false,
			socialMissed: false,
		},
		...overrides,
	},
});

const defaultFilter = {
	intensity: null,
	symptom: [],
	medicine: [],
	effectiveness: null,
	midas: [],
};

describe('filterEvents', () => {
	it('returns true when filter is empty (default)', () => {
		expect(filterEvents(makeEvent(), defaultFilter)).toBe(true);
	});

	describe('intensity', () => {
		it('returns true when intensity matches filter', () => {
			const result = filterEvents(makeEvent(), {
				...defaultFilter,
				intensity: INTENSITY_TYPES.HIGH,
			});
			expect(result).toBe(true);
		});

		it('returns false when intensity does not match filter', () => {
			const result = filterEvents(makeEvent(), {
				...defaultFilter,
				intensity: INTENSITY_TYPES.LOW,
			});
			expect(result).toBe(false);
		});

		it('ignores intensity filter when null', () => {
			const result = filterEvents(makeEvent(), { ...defaultFilter, intensity: null });
			expect(result).toBe(true);
		});
	});

	describe('symptoms', () => {
		it('returns true when all required symptoms are present', () => {
			const result = filterEvents(
				makeEvent({ symptoms: [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT] }),
				{ ...defaultFilter, symptom: [SYMPTOM_TYPES.NOISE] },
			);
			expect(result).toBe(true);
		});

		it('returns false when a required symptom is missing', () => {
			const result = filterEvents(makeEvent({ symptoms: [SYMPTOM_TYPES.NOISE] }), {
				...defaultFilter,
				symptom: [SYMPTOM_TYPES.LIGHT],
			});
			expect(result).toBe(false);
		});

		it('returns false for ANY symptom filter when event has no symptoms', () => {
			const result = filterEvents(makeEvent({ symptoms: [] }), {
				...defaultFilter,
				symptom: [ANY_FILTER_TYPE.ANY],
			});
			expect(result).toBe(false);
		});

		it('returns true for ANY symptom filter when event has at least one symptom', () => {
			const result = filterEvents(makeEvent({ symptoms: [SYMPTOM_TYPES.NOISE] }), {
				...defaultFilter,
				symptom: [ANY_FILTER_TYPE.ANY],
			});
			expect(result).toBe(true);
		});
	});

	describe('medicine', () => {
		it('returns true when all required medicines are present', () => {
			const result = filterEvents(makeEvent({ medicine: 'med_a,med_b' }), {
				...defaultFilter,
				medicine: [{ abbreviation: 'med_a', label: 'Medicine a' }],
			});
			expect(result).toBe(true);
		});

		it('returns false when a required medicine is missing', () => {
			const result = filterEvents(makeEvent({ medicine: 'med_a' }), {
				...defaultFilter,
				medicine: [{ abbreviation: 'med_c', label: 'Medicine c' }],
			});
			expect(result).toBe(false);
		});

		it('is case-insensitive for medicine matching', () => {
			const result = filterEvents(makeEvent({ medicine: 'MED_A' }), {
				...defaultFilter,
				medicine: [{ abbreviation: 'med_a', label: 'Medicine a' }],
			});
			expect(result).toBe(true);
		});

		it('returns false for ANY medicine filter when event has no medicine', () => {
			const result = filterEvents(makeEvent({ medicine: '' }), {
				...defaultFilter,
				medicine: [{ abbreviation: ANY_FILTER_TYPE.ANY, label: ANY_INPUT_FILTER_OPTION.label }],
			});
			expect(result).toBe(false);
		});

		it('returns true for ANY medicine filter when event has at least one medicine', () => {
			const result = filterEvents(makeEvent({ medicine: 'med_a' }), {
				...defaultFilter,
				medicine: [{ abbreviation: ANY_FILTER_TYPE.ANY, label: ANY_INPUT_FILTER_OPTION.label }],
			});
			expect(result).toBe(true);
		});

		it('trims whitespace and ignores empty entries in the medicine string', () => {
			const result = filterEvents(makeEvent({ medicine: ' med_a , , med_b ' }), {
				...defaultFilter,
				medicine: [
					{ abbreviation: 'med_a', label: 'Medicine a' },
					{ abbreviation: 'med_b', label: 'Medicine b' },
				],
			});
			expect(result).toBe(true);
		});
	});

	describe('effectiveness', () => {
		it('returns true when effectiveness filter is EFFECTIVE and at least one matches', () => {
			const result = filterEvents(makeEvent({ effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE] }), {
				...defaultFilter,
				effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
			});
			expect(result).toBe(true);
		});

		it('returns false when effectiveness filter is EFFECTIVE but none match', () => {
			const result = filterEvents(makeEvent({ effectiveness: [EFFECTIVENESS_TYPES.INEFFECTIVE] }), {
				...defaultFilter,
				effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
			});
			expect(result).toBe(false);
		});

		it('returns true when effectiveness filter is INEFFECTIVE and at least one matches', () => {
			const result = filterEvents(makeEvent({ effectiveness: [EFFECTIVENESS_TYPES.INEFFECTIVE] }), {
				...defaultFilter,
				effectiveness: EFFECTIVENESS_TYPES.INEFFECTIVE,
			});
			expect(result).toBe(true);
		});

		it('returns false when effectiveness filter is INEFFECTIVE but none match', () => {
			const result = filterEvents(makeEvent({ effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE] }), {
				...defaultFilter,
				effectiveness: EFFECTIVENESS_TYPES.INEFFECTIVE,
			});
			expect(result).toBe(false);
		});
	});

	describe('effectiveness combined with a specific medicine filter', () => {
		it('returns true when the filtered medicine matches the required effectiveness at its own index', () => {
			const result = filterEvents(
				makeEvent({
					medicine: 'med_a,med_b',
					effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE, EFFECTIVENESS_TYPES.INEFFECTIVE],
				}),
				{
					...defaultFilter,
					medicine: [{ abbreviation: 'med_a', label: 'Medicine a' }],
					effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
				},
			);
			expect(result).toBe(true);
		});

		it('returns false when the filtered medicine does not match the required effectiveness at its own index', () => {
			const result = filterEvents(
				makeEvent({
					medicine: 'med_a,med_b',
					effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE, EFFECTIVENESS_TYPES.INEFFECTIVE],
				}),
				{
					...defaultFilter,
					medicine: [{ abbreviation: 'med_b', label: 'Medicine b' }],
					effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
				},
			);
			expect(result).toBe(false);
		});

		it('returns false when the filtered medicine is not present on the event', () => {
			const result = filterEvents(
				makeEvent({
					medicine: 'med_a,med_b',
					effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE, EFFECTIVENESS_TYPES.INEFFECTIVE],
				}),
				{
					...defaultFilter,
					medicine: [{ abbreviation: 'med_c', label: 'Medicine c' }],
					effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
				},
			);
			expect(result).toBe(false);
		});

		it('returns true when all filtered medicines match their own effectiveness', () => {
			const result = filterEvents(
				makeEvent({
					medicine: 'med_a,med_b',
					effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE, EFFECTIVENESS_TYPES.EFFECTIVE],
				}),
				{
					...defaultFilter,
					medicine: [
						{ abbreviation: 'med_a', label: 'Medicine a' },
						{ abbreviation: 'med_b', label: 'Medicine b' },
					],
					effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
				},
			);
			expect(result).toBe(true);
		});

		it('returns false when only one of several filtered medicines matches the required effectiveness', () => {
			const result = filterEvents(
				makeEvent({
					medicine: 'med_a,med_b',
					effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE, EFFECTIVENESS_TYPES.INEFFECTIVE],
				}),
				{
					...defaultFilter,
					medicine: [
						{ abbreviation: 'med_a', label: 'Medicine a' },
						{ abbreviation: 'med_b', label: 'Medicine b' },
					],
					effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
				},
			);
			expect(result).toBe(false);
		});

		it('is case-insensitive when matching medicine abbreviation for the effectiveness lookup', () => {
			const result = filterEvents(
				makeEvent({
					medicine: 'MED_A,med_b',
					effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE, EFFECTIVENESS_TYPES.INEFFECTIVE],
				}),
				{
					...defaultFilter,
					medicine: [{ abbreviation: 'med_a', label: 'Medicine a' }],
					effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
				},
			);
			expect(result).toBe(true);
		});

		it('checks each filtered medicine against its own index regardless of the filter order', () => {
			const result = filterEvents(
				makeEvent({
					medicine: 'med_a,med_b',
					effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE, EFFECTIVENESS_TYPES.INEFFECTIVE],
				}),
				{
					...defaultFilter,
					medicine: [
						{ abbreviation: 'med_b', label: 'Medicine b' },
						{ abbreviation: 'med_a', label: 'Medicine a' },
					],
					effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
				},
			);
			expect(result).toBe(false);
		});

		it('falls back to the includes-based check when the medicine filter is ANY', () => {
			const result = filterEvents(
				makeEvent({
					medicine: 'med_a,med_b',
					effectiveness: [EFFECTIVENESS_TYPES.INEFFECTIVE, EFFECTIVENESS_TYPES.EFFECTIVE],
				}),
				{
					...defaultFilter,
					medicine: [{ abbreviation: ANY_FILTER_TYPE.ANY, label: ANY_INPUT_FILTER_OPTION.label }],
					effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE,
				},
			);
			expect(result).toBe(true);
		});
	});

	describe('midas', () => {
		it('returns true when all required midas flags are true', () => {
			const result = filterEvents(makeEvent(), {
				...defaultFilter,
				midas: [MIDAS_TYPES.WORK_MISSED],
			});
			expect(result).toBe(true);
		});

		it('returns false when a required midas flag is false', () => {
			const result = filterEvents(makeEvent(), {
				...defaultFilter,
				midas: [MIDAS_TYPES.WORK_IMPAIRED],
			});
			expect(result).toBe(false);
		});

		it('returns false when any of multiple required midas flags is false', () => {
			const result = filterEvents(makeEvent(), {
				...defaultFilter,
				midas: [MIDAS_TYPES.WORK_MISSED, MIDAS_TYPES.CHORES_MISSED],
			});
			expect(result).toBe(false);
		});

		it('returns true for ANY midas filter regardless of midas values', () => {
			const result = filterEvents(makeEvent(), {
				...defaultFilter,
				midas: [ANY_FILTER_TYPE.ANY],
			});
			expect(result).toBe(true);
		});

		it('returns true for ANY midas filter even when all midas flags are false', () => {
			const result = filterEvents(
				makeEvent({
					midas: {
						workMissed: false,
						workImpaired: false,
						choresMissed: false,
						choresImpaired: false,
						socialMissed: false,
					},
				}),
				{
					...defaultFilter,
					midas: [ANY_FILTER_TYPE.ANY],
				},
			);
			expect(result).toBe(true);
		});
	});
});

describe('isDefaultFilter', () => {
	it('returns true for a fully empty filter', () => {
		expect(isDefaultFilter(defaultFilter)).toBe(true);
	});

	it('returns false when intensity is set', () => {
		expect(isDefaultFilter({ ...defaultFilter, intensity: INTENSITY_TYPES.HIGH })).toBe(false);
	});

	it('returns false when symptom array is not empty', () => {
		expect(isDefaultFilter({ ...defaultFilter, symptom: [SYMPTOM_TYPES.NOISE] })).toBe(false);
	});

	it('returns false when medicine array is not empty', () => {
		expect(
			isDefaultFilter({
				...defaultFilter,
				medicine: [{ abbreviation: 'med_a', label: 'Medicine a' }],
			}),
		).toBe(false);
	});

	it('returns false when effectiveness is set', () => {
		expect(
			isDefaultFilter({ ...defaultFilter, effectiveness: EFFECTIVENESS_TYPES.EFFECTIVE }),
		).toBe(false);
	});

	it('returns false when midas array is not empty', () => {
		expect(isDefaultFilter({ ...defaultFilter, midas: [MIDAS_TYPES.WORK_MISSED] })).toBe(false);
	});
});
