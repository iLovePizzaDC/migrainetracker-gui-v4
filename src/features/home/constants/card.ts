import { CARD_TYPES } from "@/shared/constants/event/card";
import type { DropdownOption } from "@/shared/types/input/input";

export const CARD_OPTIONS: DropdownOption[] = [
  { label: "Migraine", value: CARD_TYPES.MIGRAINE },
  { label: "Duration", value: CARD_TYPES.DURATION },
  { label: "Medicine", value: CARD_TYPES.MEDICINE },
  { label: "Med-Days", value: CARD_TYPES.MOH },
]
