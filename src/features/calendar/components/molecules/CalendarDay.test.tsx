import CalendarDay from '@/features/calendar/components/molecules/CalendarDay';
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

const mockProphylaxisEvent = {
	date: new Date('2026-01-03'),
	description: { medication: 'Aimovig', dose: '70mg' },
	recurrence: ['RRULE:FREQ=WEEKLY;INTERVAL=4'],
};

const mockUseCalendar = (overrides = {}) =>
	({
		date: new Date('2026-01-01'),
		calendarEvents: [mockEvent1],
		filteredEvents: [mockEvent1],
		migrainosusFlags: Array(31).fill(false),
		prophylaxisEvents: [] as { date: Date }[],
		...overrides,
	}) as any;

const mockOpenDate = new Date('01-01-2026');
const mockOnDayClick = vi.fn();

describe('<CalendarDay />', () => {
	beforeEach(() => {
		mockOnDayClick.mockClear();
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

			render(<CalendarDay day={1} index={2} openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

			expect(screen.getByText('1')).toHaveClass('bg-white/10');
		});

		it('sets background for today', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar({ date: new Date('2025-12-01') }));

			render(<CalendarDay day={2} index={0} openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.getByText('2')).not.toHaveClass('bg-white/5');
		});

		it('does not set background for today if month is not matching', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarDay day={2} index={0} openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.getByText('2')).toHaveClass('bg-white/5');
		});

		it('selected day overrides today styling', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(
				<CalendarDay
					day={2}
					index={0}
					openDate={new Date('2026-01-02')}
					onDayClick={mockOnDayClick}
				/>,
			);

			expect(screen.getByText('2')).toHaveClass('bg-white/10');
		});

		it('sets border for filtered days', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarDay day={3} index={0} openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

			expect(screen.getByText('3')).toHaveClass('border', 'border-white/30');
		});
	});

	describe('events indicators', () => {
		it('sets color indicator for events', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarDay day={3} index={0} openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

			expect(screen.getByTestId('color-indicator-3')).toHaveClass(
				STRENGTH_MAP[mockEvent1.strength],
			);
		});

		it('hides color indicator when no event exists', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar({ calendarEvents: [] }));

			render(<CalendarDay day={2} index={0} openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.getByTestId('color-indicator-2')).toHaveClass('bg-transparent');
		});

		it('shows ring for migrainosus days', () => {
			const flags = Array(31).fill(false);
			flags[2] = true;

			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar({ migrainosusFlags: flags }));

			render(<CalendarDay day={3} index={0} openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.getByTestId('color-indicator-3')).toHaveClass('ring-1', 'ring-red-500');
		});

		it('shows a prophylaxis dot when a prophylaxis event exists for the day', () => {
			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({ prophylaxisEvents: [mockProphylaxisEvent] }),
			);

			render(<CalendarDay day={3} index={0} openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.getByTestId('prophylaxis-indicator-3')).toHaveClass('bg-cyan-400');
		});

		it('hides the prophylaxis dot when no prophylaxis event exists', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarDay day={3} index={0} openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.queryByTestId('prophylaxis-indicator-3')).not.toBeInTheDocument();
		});
	});

	describe('prophylaxis tooltip', () => {
		it('does not show tooltip content by default', () => {
			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({ prophylaxisEvents: [mockProphylaxisEvent] }),
			);

			render(<CalendarDay day={3} index={0} openDate={null} onDayClick={mockOnDayClick} />);

			expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
		});

		it('shows medication, dose and formatted recurrence when the dot is clicked', async () => {
			const user = userEvent.setup();
			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({ prophylaxisEvents: [mockProphylaxisEvent] }),
			);

			render(<CalendarDay day={3} index={0} openDate={null} onDayClick={mockOnDayClick} />);

			await user.click(screen.getByTestId('prophylaxis-indicator-3'));

			const tooltip = screen.getByRole('tooltip');
			expect(tooltip).toHaveTextContent('Aimovig 70mg');
			expect(tooltip).toHaveTextContent('every 4 weeks');
		});

		it('does not call onDayClick when the prophylaxis dot is clicked', async () => {
			const user = userEvent.setup();
			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({ prophylaxisEvents: [mockProphylaxisEvent] }),
			);

			render(<CalendarDay day={3} index={0} openDate={null} onDayClick={mockOnDayClick} />);

			await user.click(screen.getByTestId('prophylaxis-indicator-3'));

			expect(mockOnDayClick).not.toHaveBeenCalled();
		});
	});

	describe('interactions', () => {
		it('calls onDayClick on click', async () => {
			const user = userEvent.setup();
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<CalendarDay day={1} index={0} openDate={mockOpenDate} onDayClick={mockOnDayClick} />);

			await user.click(screen.getByText('1'));

			expect(mockOnDayClick).toHaveBeenCalledTimes(1);
			expect(mockOnDayClick).toHaveBeenCalledWith(1);
		});

		it('does not call onDayClick for empty days', async () => {
			const user = userEvent.setup();
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(
				<CalendarDay day={null} index={0} openDate={mockOpenDate} onDayClick={mockOnDayClick} />,
			);

			await user.click(screen.getByTestId('empty-day-0'));

			expect(mockOnDayClick).not.toHaveBeenCalled();
		});
	});
});
