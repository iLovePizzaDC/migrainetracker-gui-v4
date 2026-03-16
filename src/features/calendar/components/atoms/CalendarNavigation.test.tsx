import CalendarNavigation from '@/features/calendar/components/atoms/CalendarNavigation';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const prevMonth = vi.fn();
const nextMonth = vi.fn();

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: () => ({
		month: 'January',
		year: '2026',
		prevMonth,
		nextMonth,
	}),
}));

describe('<CalendarNavigation />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		prevMonth.mockClear();
		nextMonth.mockClear();
	});

	it('renders navigation and date', () => {
		render(<CalendarNavigation />);

		expect(screen.getByText('January 2026')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Previous month' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument();
	});

	it('calls prevMonth on button click', async () => {
		render(<CalendarNavigation />);

		await user.click(screen.getByRole('button', { name: 'Previous month' }));

		expect(prevMonth).toHaveBeenCalled();
	});

	it('calls nextMonth on button click', async () => {
		render(<CalendarNavigation />);

		await user.click(screen.getByRole('button', { name: 'Next month' }));

		expect(nextMonth).toHaveBeenCalled();
	});
});
