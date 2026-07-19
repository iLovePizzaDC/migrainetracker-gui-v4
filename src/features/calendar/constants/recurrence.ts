export type Freq = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export const FREQ_LABELS: Record<Freq, { every: string; interval: (n: number) => string }> = {
  DAILY: { every: 'every day', interval: (n) => `every ${n} days` },
  WEEKLY: { every: 'every week', interval: (n) => `every ${n} weeks` },
  MONTHLY: { every: 'every month', interval: (n) => `every ${n} months` },
  YEARLY: { every: 'every year', interval: (n) => `every ${n} years` },
};

export const WEEKDAY_LABELS: Record<string, string> = {
  MO: 'Mon',
  TU: 'Tue',
  WE: 'Wed',
  TH: 'Thu',
  FR: 'Fri',
  SA: 'Sat',
  SU: 'Sun',
};
