import { fetchUserMedicinesGet } from '@/shared/api/medicine.api';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import type { Medicine } from '@/shared/types/user/medicine';

export async function getMohMedicineFilter() {
	const medicines: Medicine[] = await fetchUserMedicinesGet();

	return medicines
		.filter(
			(medicine: Medicine) =>
				medicine.type === MEDICINE_TYPES.MIGRAINE_PAINKILLER ||
				medicine.type === MEDICINE_TYPES.PAINKILLER,
		)
		.map((medicine: Medicine) => medicine.abbreviation)
		.join(',');
}
