import type { DropdownOption } from "@/shared/types";

export const CARD_TYPES = {
  MIGRAINE: "MIGRAINE",
  MEDICINE: "MEDICINE",
  DURATION: "DURATION",
  MOH: "MOH",
} as const;

export type CardType = typeof CARD_TYPES[keyof typeof CARD_TYPES];

export const CARD_OPTIONS: DropdownOption[] = [
  { label: "Migraine", value: CARD_TYPES.MIGRAINE },
  { label: "Duration", value: CARD_TYPES.DURATION },
  { label: "Medicine", value: CARD_TYPES.MEDICINE },
  { label: "Med-Days", value: CARD_TYPES.MOH },
]
