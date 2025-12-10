export const MEDICINE_TYPES = {
    PAINKILLER: "painkiller",
    MIGRAINE_PAINKILLER: "migraine-painkiller",
    OTHERS: "others",
} as const;

export type MedicineType = typeof MEDICINE_TYPES[keyof typeof MEDICINE_TYPES];
