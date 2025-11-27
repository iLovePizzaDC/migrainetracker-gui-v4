export const CHART_TYPES = {
  PIE: "PIE",
  AREA: "AREA",
} as const;

export type ChartType = typeof CHART_TYPES[keyof typeof CHART_TYPES];
