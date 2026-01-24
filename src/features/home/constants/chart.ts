import { CHART_TYPES } from "@/shared/constants/event/card";
import type { DropdownOption } from "@/shared/types/input/input";

export const CHART_OPTIONS: DropdownOption[] = [
  { label: "Area Chart", value: CHART_TYPES.AREA },
  { label: "Pie Chart", value: CHART_TYPES.PIE },
];
