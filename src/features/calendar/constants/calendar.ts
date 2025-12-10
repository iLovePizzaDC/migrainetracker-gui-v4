import type { Event } from "@/features/calendar/types/event";
import type { DropdownOption } from "@/shared/types";

// --- INTENSITY START ---

export const INTENSITY_TYPES = {
    VERY_HIGH: "very-high",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
} as const;

export type IntensityType = typeof INTENSITY_TYPES[keyof typeof INTENSITY_TYPES];

export const INTENSITY_OPTIONS: DropdownOption[] = [
    { label: "Very High", value: INTENSITY_TYPES.VERY_HIGH },
    { label: "High", value: INTENSITY_TYPES.HIGH },
    { label: "Medium", value: INTENSITY_TYPES.MEDIUM },
    { label: "Low", value: INTENSITY_TYPES.LOW },
]

// --- SYMPTOM START ---

export const SYMPTOM_TYPES = {
    NOISE: "noi",
    LIGHT: "lig",
    SMELL: "sme",
    VISION: "vis",
    DIZZY: "diz",
    NAUSEA: "nau",
    VOMIT: "vom",
    NECK: "ne",
    JAW: "ja",
} as const;

export type SymptomType = typeof SYMPTOM_TYPES[keyof typeof SYMPTOM_TYPES];

export const SYMPTOM_OPTIONS: DropdownOption[] = [
    { label: "Noise Sensitive", value: SYMPTOM_TYPES.NOISE },
    { label: "Light Sensitive", value: SYMPTOM_TYPES.LIGHT },
    { label: "Smell Sensitive", value: SYMPTOM_TYPES.SMELL },
    { label: "Vision Problems", value: SYMPTOM_TYPES.VISION },
    { label: "Dizzy", value: SYMPTOM_TYPES.DIZZY },
    { label: "Nausea", value: SYMPTOM_TYPES.NAUSEA },
    { label: "Vomit", value: SYMPTOM_TYPES.VOMIT },
    { label: "Neck Pain", value: SYMPTOM_TYPES.NECK },
    { label: "Jaw Pain", value: SYMPTOM_TYPES.JAW },
]

// --- MIDAS START ---

export const MIDAS_TYPES = {
    WORK_MISSED: "workMissed",
    WORK_IMPAIRED: "workImpaired",
    CHORES_MISSED: "choresMissed",
    CHORES_IMPAIRED: "choresImpaired",
    SOCIAL_MISSED: "socialMissed",
} as const;

export type MidasType = typeof MIDAS_TYPES[keyof typeof MIDAS_TYPES];

export const MIDAS_OPTIONS: DropdownOption[] = [
    { label: "I missed work", value: MIDAS_TYPES.WORK_MISSED },
    { label: "my work performance was reduced", value: MIDAS_TYPES.WORK_IMPAIRED },
    { label: "I missed household chores", value: MIDAS_TYPES.CHORES_MISSED },
    { label: "my ability to do household chores was reduced", value: MIDAS_TYPES.CHORES_IMPAIRED },
    { label: "I missed social activities", value: MIDAS_TYPES.SOCIAL_MISSED },
]

// --- OTHER START ---

export const ANY_OPTION: DropdownOption = { value: 'any', label: 'Any' };

// --- STRENGTH START ---

export const STRENGTH_MAP: Record<number, Event["strength"]> = {
    200: "bg-purple-200",
    300: "bg-purple-300",
    400: "bg-purple-400",
    500: "bg-purple-500",
    600: "bg-purple-600",
    700: "bg-purple-700",
    800: "bg-purple-800",
    900: "bg-purple-900",
    950: "bg-purple-950"
};
