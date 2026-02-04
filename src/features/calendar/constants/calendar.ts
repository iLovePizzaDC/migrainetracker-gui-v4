export const STRENGTH_MAP = {
    200: "purple-200",
    300: "purple-300",
    400: "purple-400",
    500: "purple-500",
    600: "purple-600",
    700: "purple-700",
    800: "purple-800",
    900: "purple-900",
    950: "purple-950"
} as const;

export type StrengthKey = keyof typeof STRENGTH_MAP;

export const MIGRAINOSUS_FLAG_THRESHOLD = 4;
