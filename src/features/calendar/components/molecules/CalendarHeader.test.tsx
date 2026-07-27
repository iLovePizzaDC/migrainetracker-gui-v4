import CalendarHeader from '@/features/calendar/components/molecules/CalendarHeader';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: () => ({
		month: 'January',
		year: '2026',
		prevMonth: vi.fn(),
		nextMonth: vi.fn(),
	}),
}));

describe('<CalendarHeader />', () => {
	it('renders navigation with weekdays', () => {
		render(<CalendarHeader />);

		expect(screen.getByTestId('calendar-navigation')).toBeInTheDocument();
		expect(screen.getByTestId('weekdays')).toBeInTheDocument();
	});
});
