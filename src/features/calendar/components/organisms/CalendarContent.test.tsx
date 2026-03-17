import CalendarContent from '@/features/calendar/components/organisms/CalendarContent';
import { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: vi.fn(),
}));

const mockEvent1 = {
	date: new Date('2026-01-03'),
	description: {},
	strength: 200 as keyof typeof STRENGTH_MAP,
};
const mockEvent2 = {
	date: new Date('2026-01-04'),
	description: {},
	strength: 500 as keyof typeof STRENGTH_MAP,
};
const mockUseCalendar = (overrides = {}) =>
	({
		isLoading: false,
		date: new Date('2026-01-01'),
		daysArray: [null, null, 1, 2, 3],
		calendarEvents: [mockEvent1, mockEvent2],
		filteredEvents: [mockEvent1],
		migrainosusFlags: Array(31).fill(false),
		...overrides,
	}) as any;
const mockOpenDate = new Date('01-01-2026');
const mockOnDayClick = vi.fn();

describe('<CalendarContent /', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnDayClick.mockClear();
	});

	describe('rendering', () => {
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

			const emptyDays = screen.getAllByTestId(/^empty-day-\d+$/);
			expect(emptyDays).toHaveLength(2);
			emptyDays.forEach((el) => {
				expect(el).toHaveClass('opacity-0');
			});
		});
	});

	describe('day styling', () => {
		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date('2026-01-02'));
		});

		afterEach(() => {
			vi.useRealTimers();
			vi.clearAllMocks();
		});

		it('sets background for selected day', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarContent openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

			expect(screen.getByText('1')).toHaveClass('bg-white/10');
		});

		it('sets background for selected day if today', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarContent openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.getByText('2')).toHaveClass('bg-white/5');
		});

		it('selected day overrides today styling', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarContent openDate={new Date('2026-01-02')} onDayClick={mockOnDayClick} />);

			expect(screen.getByText('2')).toHaveClass('bg-white/10');
		});

		it('sets border for filtered days', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarContent openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

			expect(screen.getByText('3')).toHaveClass('border', 'border-white/30');
		});
	});

	describe('events indicators', () => {
		it('sets color indicator for events', () => {
			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({
					calendarEvents: [mockEvent1],
				}),
			);

			render(<CalendarContent openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

			expect(screen.getByTestId('color-indicator-3')).toHaveClass(
				STRENGTH_MAP[mockEvent1.strength],
			);
		});

		it('hides color indicator when no event exists', () => {
			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({
					calendarEvents: [],
				}),
			);

			render(<CalendarContent openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.getByTestId('color-indicator-2')).toHaveClass('bg-transparent');
		});

		it('shows ring for migrainosus days', () => {
			const flags = Array(31).fill(false);
			flags[2] = true;

			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({
					migrainosusFlags: flags,
				}),
			);

			render(<CalendarContent openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.getByTestId('color-indicator-3')).toHaveClass('ring-1', 'ring-red-500');
		});
	});

	describe('interactions', () => {
		it('calls onDayClick for event days click', async () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarContent openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

			await user.click(screen.getByText('1'));

			expect(mockOnDayClick).toHaveBeenCalledTimes(1);
			expect(mockOnDayClick).toHaveBeenCalledWith(1);
		});

		it('does not call onDayClick for empty days', async () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarContent openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

			await user.click(screen.getByTestId('empty-day-0'));

			expect(mockOnDayClick).not.toHaveBeenCalled();
		});
	});
});
