import CalendarNavigation from '@/features/calendar/components/atoms/CalendarNavigation';
import Weekdays from '@/features/calendar/components/atoms/Weekdays';

function CalendarHeader() {
  return (
    <div data-testid='calendar-header'>
      <CalendarNavigation />
      <Weekdays />
    </div>
  );
}

export default CalendarHeader;
