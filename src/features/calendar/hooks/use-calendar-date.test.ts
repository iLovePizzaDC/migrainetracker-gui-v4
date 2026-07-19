import { useCalendarDate } from '@/features/calendar/hooks/use-calendar-date';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

function renderCalendarDate() {
  return renderHook(() => useCalendarDate());
}

describe('useCalendarDate', () => {
  describe('initial state', () => {
    it('initializes with the current month and year', () => {
      const { result } = renderCalendarDate();
      const now = new Date();

      expect(result.current.year).toBe(now.getFullYear());
      expect(result.current.month).toBe(now.toLocaleString('en-US', { month: 'long' }));
    });

    it('sets firstDayOfMonth to the 1st of the current month', () => {
      const { result } = renderCalendarDate();
      const first = result.current.firstDayOfMonth;

      expect(first.getDate()).toBe(1);
      expect(first.getMonth()).toBe(new Date().getMonth());
      expect(first.getFullYear()).toBe(new Date().getFullYear());
    });

    it('sets lastDayOfMonth to the last day of the current month', () => {
      const { result } = renderCalendarDate();
      const last = result.current.lastDayOfMonth;
      const expected = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      expect(last.getDate()).toBe(expected.getDate());
    });

    it('daysArray starts with nulls for weekday offset and then 1..daysInMonth', () => {
      const { result } = renderCalendarDate();
      const { daysArray, daysInMonth, firstDayOfMonth } = result.current;

      const expectedOffset = (firstDayOfMonth.getDay() + 6) % 7;
      const nullCount = daysArray.filter((d) => d === null).length;
      const numbers = daysArray.filter((d) => d !== null) as number[];

      expect(nullCount).toBe(expectedOffset);
      expect(numbers).toHaveLength(daysInMonth);
      expect(numbers[0]).toBe(1);
      expect(numbers[numbers.length - 1]).toBe(daysInMonth);
    });
  });

  describe('prevMonth / nextMonth', () => {
    it('prevMonth navigates to the previous month', () => {
      const { result } = renderCalendarDate();
      const before = result.current.currentDate;

      act(() => result.current.prevMonth());

      const expected = new Date(before.getFullYear(), before.getMonth() - 1, 1);
      expect(result.current.currentDate).toEqual(expected);
    });

    it('nextMonth navigates to the next month', () => {
      const { result } = renderCalendarDate();
      const before = result.current.currentDate;

      act(() => result.current.nextMonth());

      const expected = new Date(before.getFullYear(), before.getMonth() + 1, 1);
      expect(result.current.currentDate).toEqual(expected);
    });

    it('prevMonth wraps from January to December of the previous year', () => {
      const { result } = renderCalendarDate();

      act(() => result.current.setMonth(new Date(2026, 0, 1)));
      act(() => result.current.prevMonth());

      expect(result.current.month).toBe('December');
      expect(result.current.year).toBe(2025);
    });

    it('nextMonth wraps from December to January of the next year', () => {
      const { result } = renderCalendarDate();

      act(() => result.current.setMonth(new Date(2025, 11, 1)));
      act(() => result.current.nextMonth());

      expect(result.current.month).toBe('January');
      expect(result.current.year).toBe(2026);
    });
  });

  describe('setMonth', () => {
    it('setMonth navigates to the given month', () => {
      const { result } = renderCalendarDate();

      act(() => result.current.setMonth(new Date(2026, 4, 15)));

      expect(result.current.month).toBe('May');
      expect(result.current.year).toBe(2026);
      expect(result.current.currentDate.getDate()).toBe(1);
    });

    it('setMonth does not trigger a re-render when the month is already active', () => {
      const { result } = renderCalendarDate();

      act(() => result.current.setMonth(new Date(2026, 4, 1)));
      const snapshotBefore = result.current.currentDate;

      act(() => result.current.setMonth(new Date(2026, 4, 20)));

      expect(result.current.currentDate).toBe(snapshotBefore);
    });
  });

  describe('daysInMonth', () => {
    it('daysInMonth is correct for February in a leap year', () => {
      const { result } = renderCalendarDate();

      act(() => result.current.setMonth(new Date(2024, 1, 1)));

      expect(result.current.daysInMonth).toBe(29);
    });

    it('daysInMonth is correct for February in a non-leap year', () => {
      const { result } = renderCalendarDate();

      act(() => result.current.setMonth(new Date(2025, 1, 1)));

      expect(result.current.daysInMonth).toBe(28);
    });
  });
});
