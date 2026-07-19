import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import type { Medicine } from '@/shared/types/user/medicine';

export async function getMohMedicineFilter(medicines: Medicine[] | null) {
  return medicines === null
    ? ''
    : medicines
      .filter(
        (medicine: Medicine) =>
          medicine.type === MEDICINE_TYPES.MIGRAINE_PAINKILLER ||
          medicine.type === MEDICINE_TYPES.PAINKILLER,
      )
      .map((medicine: Medicine) => medicine.abbreviation)
      .join(',');
}
