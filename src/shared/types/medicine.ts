import type { MedicineType } from '@/shared/constants/user/medicine';

export type Medicine = {
	name: string;
	abbreviation: string;
	type: MedicineType;
};
