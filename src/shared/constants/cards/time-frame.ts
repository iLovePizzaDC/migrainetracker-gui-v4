export const TIME_FRAME_UNIT_STATES = {
  DAYS: "DAYS",
  MONTHS: "MONTHS",
} as const;

export type TimeFrameUnit = typeof TIME_FRAME_UNIT_STATES[keyof typeof TIME_FRAME_UNIT_STATES];
