import CalendarContent from '@/features/calendar/components/organisms/CalendarContent';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: vi.fn(),
}));

vi.mock('@/features/calendar/components/molecules/CalendarDay', () => ({
	default: ({ day, index, onDayClick }: any) => (
		<div
			data-testid={day ? `day-${day}` : `empty-day-${index}`}
			onClick={() => day && onDayClick(day)}
		>
			{day ?? ''}
		</div>
	),
}));

const mockUseCalendar = (overrides = {}) =>
	({
		isLoading: false,
		daysArray: [null, null, 1, 2, 3],
		...overrides,
	}) as any;

const mockOpenDate = new Date('01-01-2026');
const mockOnDayClick = vi.fn();

describe('<CalendarContent />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnDayClick.mockClear();
	});

	it('shows skeletons when loading', () => {
		vi.mocked(useCalendar).mockReturnValue(mockUseCalendar({ isLoading: true }));

		render(<CalendarContent openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

		expect(screen.getAllByTestId('day-skeleton')).toHaveLength(35);
	});

	it('shows days when it is not loading', () => {
		vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

		render(<CalendarContent openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

		expect(screen.getAllByTestId(/^day-\d+$/)).toHaveLength(3);
	});

	it('hides empty days', () => {
		vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

		render(<CalendarContent openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

		expect(screen.getAllByTestId(/^empty-day-\d+$/)).toHaveLength(2);
	});

	it('forwards onDayClick to CalendarDay', async () => {
		vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

		render(<CalendarContent openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

		await user.click(screen.getByText('1'));

		expect(mockOnDayClick).toHaveBeenCalledWith(1);
	});
});
