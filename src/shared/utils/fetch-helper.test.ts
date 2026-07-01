import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import { getMohMedicineFilter } from '@/shared/utils/fetch-helper';
import { describe, expect, it } from 'vitest';

const makeMedicine = (abbreviation: string, type: string) => ({
	name: abbreviation,
	abbreviation,
	type,
});

describe('getMohMedicineFilter', () => {
	it('returns comma-separated abbreviations of MOH medicines', async () => {
		const medicines = [
			makeMedicine('at', MEDICINE_TYPES.PAINKILLER),
			makeMedicine('zt-smt', MEDICINE_TYPES.MIGRAINE_PAINKILLER),
		];

		const result = await getMohMedicineFilter(medicines as any);

		expect(result).toBe('at,zt-smt');
	});

	it('filters out non-MOH medicine types', async () => {
		const medicines = [
			makeMedicine('at', MEDICINE_TYPES.PAINKILLER),
			makeMedicine('vit', 'VITAMIN'),
			makeMedicine('zt-smt', MEDICINE_TYPES.MIGRAINE_PAINKILLER),
		];

		const result = await getMohMedicineFilter(medicines as any);

		expect(result).toBe('at,zt-smt');
	});

	it('returns empty string when medicines is null', async () => {
		const result = await getMohMedicineFilter(null);

		expect(result).toBe('');
	});

	it('returns empty string when medicines array is empty', async () => {
		const result = await getMohMedicineFilter([]);

		expect(result).toBe('');
	});

	it('includes both PAINKILLER and MIGRAINE_PAINKILLER types', async () => {
		const medicines = [
			makeMedicine('at', MEDICINE_TYPES.PAINKILLER),
			makeMedicine('zt-smt', MEDICINE_TYPES.MIGRAINE_PAINKILLER),
			makeMedicine('st', MEDICINE_TYPES.PAINKILLER),
		];

		const result = await getMohMedicineFilter(medicines as any);

		expect(result).toBe('at,zt-smt,st');
	});
});
