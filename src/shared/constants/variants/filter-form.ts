export const FILTER_FORM_VARIANTS = {
    STANDARD: "standard",
    COMPACT: "compact",
} as const;

export type FilterFormVariant = typeof FILTER_FORM_VARIANTS[keyof typeof FILTER_FORM_VARIANTS];
