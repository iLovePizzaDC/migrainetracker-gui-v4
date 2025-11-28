import type { DropdownOption } from "../../../../shared/types";

export const CHART_TYPES = {
  PIE: "PIE",
  AREA: "AREA",
} as const;

export type ChartType = typeof CHART_TYPES[keyof typeof CHART_TYPES];

export const CHART_OPTIONS: DropdownOption[] = [
  { label: "Area Chart", value: CHART_TYPES.AREA },
  { label: "Pie Chart", value: CHART_TYPES.PIE },
];
