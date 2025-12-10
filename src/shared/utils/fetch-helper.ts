import { fetchUserMedicinesGet } from "@/shared/api/medicine.api";
import type { Medicine } from "@/shared/types/user/medicine";
import { MEDICINE_TYPES } from "../constants/user/medicine";

export async function getMohMedicineFilter(userId: string) {
    const medicines: Medicine[] = await fetchUserMedicinesGet(userId);

    return medicines
        .filter((medicine: Medicine) => medicine.type === MEDICINE_TYPES.MIGRAINE_PAINKILLER || medicine.type === MEDICINE_TYPES.PAINKILLER)
        .map((medicine: Medicine) => medicine.abbreviation)
        .join(",");
}
