import { type Freq, FREQ_LABELS, WEEKDAY_LABELS } from '@/features/calendar/constants/recurrence';

function isFreq(value: string | undefined): value is Freq {
  return !!value && value in FREQ_LABELS;
}

function parseRRuleParams(rrule: string): Record<string, string> {
  return Object.fromEntries(
    rrule
      .replace(/^RRULE:/, '')
      .split(';')
      .map((pair) => pair.split('=') as [string, string]),
  );
}

export function formatRecurrence(rrules: string[] | null): string | null {
  if (!rrules?.length) return null;

  const params = parseRRuleParams(rrules[0]);
  if (!isFreq(params.FREQ)) return null;

  const interval = Number(params.INTERVAL ?? 1);
  const { every, interval: intervalLabel } = FREQ_LABELS[params.FREQ];
  const base = interval > 1 ? intervalLabel(interval) : every;

  const byDay = params.BYDAY?.split(',')
    .map((day) => WEEKDAY_LABELS[day] ?? day)
    .join(', ');

  return byDay ? `${base} (${byDay})` : base;
}
