import { fetchUserMedicinesGet } from "@/shared/api/medicine.api";
import type { Medicine } from "@/shared/types/user/medicine";

export async function getMohMedicineFilter(userId: string) {
    const medicines: Medicine[] = await fetchUserMedicinesGet(userId);

    return medicines
        .filter((medicine: Medicine) => medicine.type === "migraine-painkiller" || medicine.type === "painkiller")
        .map((medicine: Medicine) => medicine.abbreviation)
        .join(",");
}
