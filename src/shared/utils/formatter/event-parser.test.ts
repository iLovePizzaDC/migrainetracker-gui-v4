import { formatEffectiveness, formatMedicine } from '@/shared/utils/formatter/event-parser';
import { describe, expect, it } from 'vitest';

const makeMedicine = (abbreviation: string, taken: number, effectiveness: number) => ({
	medicine: { abbreviation, label: abbreviation.toUpperCase() },
	taken,
	effectiveness,
});

describe('formatMedicine', () => {
	it('returns single medicine repeated by taken count', () => {
		expect(formatMedicine([makeMedicine('ibu', 3, 0)])).toBe('ibu,ibu,ibu');
	});

	it('returns multiple medicines concatenated', () => {
		expect(formatMedicine([makeMedicine('ibu', 2, 0), makeMedicine('par', 1, 0)])).toBe(
			'ibu,ibu,par',
		);
	});

	it('returns empty string for empty array', () => {
		expect(formatMedicine([])).toBe('');
	});

	it('returns single entry for taken=1', () => {
		expect(formatMedicine([makeMedicine('asp', 1, 0)])).toBe('asp');
	});
});

describe('formatEffectiveness', () => {
	it('returns all "yes" when effectiveness equals taken', () => {
		expect(formatEffectiveness([makeMedicine('ibu', 2, 2)])).toBe('yes,yes');
	});

	it('returns all "no" when effectiveness is 0', () => {
		expect(formatEffectiveness([makeMedicine('ibu', 2, 0)])).toBe('no,no');
	});

	it('returns mixed "no" and "yes"', () => {
		expect(formatEffectiveness([makeMedicine('ibu', 3, 1)])).toBe('no,no,yes');
	});

	it('handles multiple medicines', () => {
		const result = formatEffectiveness([makeMedicine('ibu', 2, 1), makeMedicine('par', 1, 1)]);
		expect(result).toBe('no,yes,yes');
	});

	it('returns empty string for empty array', () => {
		expect(formatEffectiveness([])).toBe('');
	});
});
