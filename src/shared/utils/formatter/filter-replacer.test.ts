import { ANY_FILTER_TYPE } from '@/shared/constants/event/event-details';
import { replaceAnyWithNull } from '@/shared/utils/formatter/filter-replacer';
import { describe, expect, it } from 'vitest';

describe('replaceAnyWithNull', () => {
	it('replaces ANY string with null', () => {
		expect(replaceAnyWithNull(ANY_FILTER_TYPE.ANY)).toBeNull();
	});

	it('leaves non-ANY strings unchanged', () => {
		expect(replaceAnyWithNull('high')).toBe('high');
	});

	it('leaves null unchanged', () => {
		expect(replaceAnyWithNull(null)).toBeNull();
	});

	it('leaves numbers unchanged', () => {
		expect(replaceAnyWithNull(42)).toBe(42);
	});

	it('replaces ANY entries in an array with null', () => {
		const result = replaceAnyWithNull(['high', ANY_FILTER_TYPE.ANY, 'low']);
		expect(result).toEqual(['high', null, 'low']);
	});

	it('replaces all ANY entries in an array with null', () => {
		expect(replaceAnyWithNull([ANY_FILTER_TYPE.ANY])).toEqual([null]);
	});

	it('replaces medicine object with ANY abbreviation with null', () => {
		const input = { abbreviation: ANY_FILTER_TYPE.ANY, label: 'Any' };
		expect(replaceAnyWithNull(input)).toBeNull();
	});

	it('leaves medicine object with non-ANY abbreviation unchanged', () => {
		const input = { abbreviation: 'ibu', label: 'Ibuprofen' };
		expect(replaceAnyWithNull(input)).toEqual(input);
	});

	it('recursively replaces ANY values in nested objects', () => {
		const input = { intensity: ANY_FILTER_TYPE.ANY, symptom: ['noi'] };
		const result = replaceAnyWithNull(input);

		expect(result).toEqual({ intensity: null, symptom: ['noi'] });
	});

	it('recursively processes nested arrays', () => {
		const input = { midas: [ANY_FILTER_TYPE.ANY, 'workMissed'] };
		const result = replaceAnyWithNull(input);

		expect((result as any).midas).toEqual([null, 'workMissed']);
	});
});
