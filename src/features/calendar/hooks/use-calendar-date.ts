import { useMemo, useState } from 'react';

export function useCalendarDate() {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const month = currentDate.toLocaleString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();

  const firstDayOfMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate],
  );

  const lastDayOfMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    [currentDate],
  );

  const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = lastDayOfMonth.getDate();

  const daysArray = useMemo(() => {
    const array: (number | null)[] = [];
    for (let index = 0; index < firstWeekday; index++) array.push(null);
    for (let index = 1; index <= daysInMonth; index++) array.push(index);
    return array;
  }, [firstWeekday, daysInMonth]);

  const setMonth = (date: Date) => {
    setCurrentDate((current) => {
      if (current.getMonth() === date.getMonth() && current.getFullYear() === date.getFullYear()) {
        return current;
      }

      return new Date(date.getFullYear(), date.getMonth(), 1);
    });
  };

  const prevMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return {
    currentDate,
    firstDayOfMonth,
    lastDayOfMonth,
    daysArray,
    daysInMonth,
    month,
    year,
    setMonth,
    prevMonth,
    nextMonth,
  };
}
