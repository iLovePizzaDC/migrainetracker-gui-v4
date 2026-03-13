import type { DropdownOption } from "@/shared/types/input/input";

export const MEDICINE_TYPES = {
    PAINKILLER: "painkiller",
    MIGRAINE_PAINKILLER: "migraine-painkiller",
    OTHERS: "others",
} as const;

export type MedicineType = typeof MEDICINE_TYPES[keyof typeof MEDICINE_TYPES];

export const MEDICINE_OPTIONS: DropdownOption[] = [
    { label: "Painkiller", value: MEDICINE_TYPES.PAINKILLER },
    { label: "Migraine-Painkiller", value: MEDICINE_TYPES.MIGRAINE_PAINKILLER },
    { label: "Others", value: MEDICINE_TYPES.OTHERS },
]
