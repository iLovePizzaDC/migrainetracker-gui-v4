import * as medicineApi from '@/shared/api/medicine.api';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import { getMohMedicineFilter } from '@/shared/utils/fetch-helper';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/medicine.api');

const makeMedicine = (abbreviation: string, type: string) => ({
	name: abbreviation,
	abbreviation,
	type,
});

describe('getMohMedicineFilter', () => {
	afterEach(() => vi.clearAllMocks());

	it('returns comma-separated abbreviations of MOH medicines', async () => {
		vi.mocked(medicineApi.fetchUserMedicinesGet).mockResolvedValue([
			makeMedicine('ibu', MEDICINE_TYPES.PAINKILLER),
			makeMedicine('tri', MEDICINE_TYPES.MIGRAINE_PAINKILLER),
		] as any);

		const result = await getMohMedicineFilter();
		expect(result).toBe('ibu,tri');
	});

	it('filters out non-MOH medicine types', async () => {
		vi.mocked(medicineApi.fetchUserMedicinesGet).mockResolvedValue([
			makeMedicine('ibu', MEDICINE_TYPES.PAINKILLER),
			makeMedicine('vit', 'VITAMIN'),
			makeMedicine('tri', MEDICINE_TYPES.MIGRAINE_PAINKILLER),
		] as any);

		const result = await getMohMedicineFilter();
		expect(result).toBe('ibu,tri');
	});

	it('returns empty string when no MOH medicines exist', async () => {
		vi.mocked(medicineApi.fetchUserMedicinesGet).mockResolvedValue([
			makeMedicine('vit', 'VITAMIN'),
		] as any);

		const result = await getMohMedicineFilter();
		expect(result).toBe('');
	});

	it('returns empty string when medicines array is empty', async () => {
		vi.mocked(medicineApi.fetchUserMedicinesGet).mockResolvedValue([]);

		const result = await getMohMedicineFilter();
		expect(result).toBe('');
	});

	it('includes both PAINKILLER and MIGRAINE_PAINKILLER types', async () => {
		vi.mocked(medicineApi.fetchUserMedicinesGet).mockResolvedValue([
			makeMedicine('ibu', MEDICINE_TYPES.PAINKILLER),
			makeMedicine('tri', MEDICINE_TYPES.MIGRAINE_PAINKILLER),
			makeMedicine('asp', MEDICINE_TYPES.PAINKILLER),
		] as any);

		const result = await getMohMedicineFilter();
		expect(result).toBe('ibu,tri,asp');
	});
});
