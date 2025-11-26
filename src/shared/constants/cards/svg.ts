export const SVG_STATES = {
  HEADACHE: "HEADACHE",
  CLOCK: "CLOCK",
  PILL: "PILL",
  MOH: "MOH",
} as const;

export type SVG = typeof SVG_STATES[keyof typeof SVG_STATES];
