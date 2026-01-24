import { TIME_FRAME_UNITS } from "@/shared/constants/event/card";
import type { DropdownOption } from "@/shared/types/input/input";

export const TIME_FRAME_UNIT_OPTIONS: DropdownOption[] = [
  { label: "Days", value: TIME_FRAME_UNITS.DAYS },
  { label: "Months", value: TIME_FRAME_UNITS.MONTHS },
];
