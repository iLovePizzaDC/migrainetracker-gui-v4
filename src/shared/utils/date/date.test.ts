import {
  formatDateToUs,
  getDateAfterDays,
  getDateBeforeDays,
  getDateBeforeMonths,
  getDayDifference,
  getEndOfMonth,
  getStartOfMonth,
  normalizeDate,
  parseDecimalToTime,
  parseTimeToDecimal,
} from '@/shared/utils/date/date';
import { describe, expect, it } from 'vitest';

describe('parseTimeToDecimal', () => {
  it('converts "10:00" to 10', () => expect(parseTimeToDecimal('10:00')).toBe(10));
  it('converts "10:30" to 10.5', () => expect(parseTimeToDecimal('10:30')).toBe(10.5));
  it('converts "00:00" to 0', () => expect(parseTimeToDecimal('00:00')).toBe(0));
  it('converts "23:59" correctly', () => expect(parseTimeToDecimal('23:59')).toBe(23.98));
});

describe('parseDecimalToTime', () => {
  it('converts 10 to "10:00"', () => expect(parseDecimalToTime(10)).toBe('10:00'));
  it('converts 10.5 to "10:30"', () => expect(parseDecimalToTime(10.5)).toBe('10:30'));
  it('converts 0 to "00:00"', () => expect(parseDecimalToTime(0)).toBe('00:00'));
  it('pads hours and minutes with leading zeros', () =>
    expect(parseDecimalToTime(1.5)).toBe('01:30'));
});

describe('formatDateToUs', () => {
  it('formats date as YYYY-MM-DD', () => {
    expect(formatDateToUs(new Date('2026-01-05'))).toBe('2026-01-05');
  });

  it('pads month and day with leading zeros', () => {
    expect(formatDateToUs(new Date('2026-03-07'))).toBe('2026-03-07');
  });
});

describe('getDateAfterDays', () => {
  it('returns date 3 days after', () => {
    const result = getDateAfterDays(new Date('2026-01-01'), 3);
    expect(result.getDate()).toBe(4);
  });

  it('wraps month correctly', () => {
    const result = getDateAfterDays(new Date('2026-01-31'), 1);
    expect(result.getMonth()).toBe(1);
  });
});

describe('getDateBeforeDays', () => {
  it('returns date 3 days before', () => {
    const result = getDateBeforeDays(new Date('2026-01-10'), 3);
    expect(result.getDate()).toBe(7);
  });

  it('wraps month correctly', () => {
    const result = getDateBeforeDays(new Date('2026-02-01'), 1);
    expect(result.getMonth()).toBe(0);
  });
});

describe('getDateBeforeMonths', () => {
  it('returns date 3 months before', () => {
    const result = getDateBeforeMonths(new Date('2026-04-01'), 3);
    expect(result.getMonth()).toBe(0);
  });

  it('wraps year correctly', () => {
    const result = getDateBeforeMonths(new Date('2026-01-01'), 1);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(11);
  });
});

describe('getDayDifference', () => {
  it('returns 1 for the same day', () => {
    expect(getDayDifference(new Date('2026-01-01'), new Date('2026-01-01'))).toBe(1);
  });

  it('returns correct difference for a range', () => {
    expect(getDayDifference(new Date('2026-01-01'), new Date('2026-01-31'))).toBe(31);
  });

  it('ignores time component', () => {
    const start = new Date('2026-01-01T10:00:00');
    const end = new Date('2026-01-03T22:00:00');
    expect(getDayDifference(start, end)).toBe(3);
  });
});

describe('normalizeDate', () => {
  it('sets time to midnight', () => {
    const result = normalizeDate(new Date('2026-01-01T15:30:00'));
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('does not mutate the original date', () => {
    const original = new Date('2026-01-01T15:30:00');
    normalizeDate(original);
    expect(original.getHours()).toBe(15);
  });
});

describe('getStartOfMonth', () => {
  it('returns the first day of the month at midnight', () => {
    const result = getStartOfMonth(new Date('2026-03-15'));
    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(2);
    expect(result.getHours()).toBe(0);
  });
});

describe('getEndOfMonth', () => {
  it('returns the last day of the month at 23:59:59', () => {
    const result = getEndOfMonth(new Date('2026-01-15'));
    expect(result.getDate()).toBe(31);
    expect(result.getHours()).toBe(23);
    expect(result.getSeconds()).toBe(59);
  });

  it('handles February in a leap year', () => {
    const result = getEndOfMonth(new Date('2024-02-10'));
    expect(result.getDate()).toBe(29);
  });
});
