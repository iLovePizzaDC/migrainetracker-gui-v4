import type { DropdownOption } from "@/shared/types";

export const TIME_FRAME_UNITS = {
  DAYS: "DAYS",
  MONTHS: "MONTHS",
} as const;

export type TimeFrameUnit = typeof TIME_FRAME_UNITS[keyof typeof TIME_FRAME_UNITS];

export const TIME_FRAME_UNIT_OPTIONS: DropdownOption[] = [
  { label: "Days", value: TIME_FRAME_UNITS.DAYS },
  { label: "Months", value: TIME_FRAME_UNITS.MONTHS },
];
