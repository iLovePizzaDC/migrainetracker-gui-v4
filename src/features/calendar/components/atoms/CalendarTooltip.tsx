import type { ReactNode, Ref } from 'react';

interface ICalendarTooltip {
  ref: Ref<HTMLDivElement> | undefined;
  children: ReactNode;
}

function CalendarTooltip({ ref, children }: ICalendarTooltip) {
  return (
    <div
      ref={ref}
      className='absolute left-1/2 top-6 -translate-x-1/2 z-50 w-64 rounded-lg bg-black/60 backdrop-blur border border-white/10 p-3 text-xs shadow-xl animate-fade-in'
    >
      {children}
    </div>
  );
}

export default CalendarTooltip;
