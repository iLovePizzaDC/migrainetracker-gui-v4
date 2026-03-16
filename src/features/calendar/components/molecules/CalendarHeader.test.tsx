import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CalendarHeader from './CalendarHeader';

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
