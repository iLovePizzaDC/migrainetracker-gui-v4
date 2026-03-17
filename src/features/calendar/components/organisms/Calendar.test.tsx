import Calendar from '@/features/calendar/components/organisms/Calendar';
import type { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { SYMPTOM_TYPES } from '@/shared/constants/event/event-details';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const mockMedLabel = 'test medicine';
const mockMedValue = 'tst_med';
const mockUserMedicine = {
	label: `${mockMedLabel} 1`,
	value: `${mockMedValue}_1`,
};

vi.mock('@/shared/hooks/user/use-user', () => ({
	useUser: () => ({
		userMedicineOptions: [mockUserMedicine],
	}),
}));

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: vi.fn(),
}));

vi.mock('@/features/calendar/components/molecules/Durations', () => ({
	default: () => <div>durations</div>,
}));

vi.mock('@/shared/components/atoms/Combobox', () => ({
	default: () => <div>combobox</div>,
}));

const mockEvent1 = {
	date: new Date('2026-01-03'),
	description: {
		duration: [
			{
				start: 10,
				end: 15,
			},
		],
		intensity: 'high',
		symptoms: [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT, SYMPTOM_TYPES.SMELL],
		medicine: mockUserMedicine.value,
		effectiveness: ['yes'],
		midas: {
			workMissed: true,
			workImpaired: false,
			choresMissed: true,
			choresImpaired: false,
			socialMissed: false,
		},
	},
	strength: 200 as keyof typeof STRENGTH_MAP,
};

const mockEvent2 = {
	date: new Date('2026-01-04'),
	description: {
		duration: [
			{
				start: 10,
				end: 15,
			},
		],
		intensity: 'high',
		symptoms: [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT, SYMPTOM_TYPES.SMELL],
		medicine: mockUserMedicine.value,
		effectiveness: ['yes'],
		midas: {
			workMissed: true,
			workImpaired: false,
			choresMissed: true,
			choresImpaired: false,
			socialMissed: false,
		},
	},
	strength: 500 as keyof typeof STRENGTH_MAP,
};

const mockUseCalendar = (overrides = {}) =>
	({
		isLoading: false,
		date: new Date('01-01-2026'),
		daysArray: [null, null, 1, 2, 3],
		calendarEvents: [mockEvent1, mockEvent2],
		filteredEvents: [mockEvent1],
		migrainosusFlags: Array(31).fill(false),
		filter: {
			intensity: null,
			symptom: [],
			medicine: [],
			effectiveness: null,
			midas: [],
		},
		setFilter: vi.fn(),
		setMonth: vi.fn(),
		userMedicineOptions: [mockUserMedicine],
		...overrides,
	}) as any;

describe('<Calendar />', () => {
	const user = userEvent.setup();

	describe('rendering', () => {
		it('renders CalendarHeader', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			expect(screen.getByTestId('calendar-header')).toBeInTheDocument();
		});

		it('renders CalendarContent', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			expect(screen.getByTestId('calendar-content')).toBeInTheDocument();
		});

		it('renders FilterCard', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			expect(screen.getByText('Filter')).toBeInTheDocument();
		});

		it('renders MigrainePanel with isOpen false by default', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			expect(screen.getByTestId('migraine-panel')).toHaveClass(
				'opacity-0',
				'max-h-0',
				'pointer-events-none',
			);
		});

		it('renders load entry button', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			expect(screen.getByTestId('load-entry')).toBeInTheDocument();
		});

		it('disables load entry button when isLoading is true', () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar({ isLoading: true }));

			render(<Calendar />);

			expect(screen.getByTestId('load-entry')).toBeDisabled();
		});
	});

	describe('interactions', () => {
		it('opens panel when clicking a day without event', async () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			await user.click(screen.getByText('1'));

			expect(screen.getByTestId('migraine-panel')).toHaveClass('opacity-100', 'max-h-[2000px]');
		});

		it('opens panel clicking a day with event', async () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			await user.click(screen.getByText('3'));

			expect(screen.getByTestId('migraine-panel')).toHaveClass('opacity-100', 'max-h-[2000px]');
		});

		it('loads entry from localStorage when clicking load entry button', async () => {
			const storedEntry = {
				date: '2026-01-05',
				medicines: [],
				midas: {
					workMissed: false,
					workImpaired: false,
					choresMissed: false,
					choresImpaired: false,
					socialMissed: false,
				},
			};
			localStorage.setItem('MT_NE', JSON.stringify(storedEntry));

			const setMonthMock = vi.fn();
			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({
					setMonth: setMonthMock,
				}),
			);

			render(<Calendar />);

			await user.click(screen.getByTestId('load-entry'));

			expect(setMonthMock).toHaveBeenCalled();
			expect(screen.getByTestId('migraine-panel')).toHaveClass('opacity-100', 'max-h-[2000px]');
		});

		it('does not change state when clicking load entry button if no entry in localStorage', async () => {
			localStorage.removeItem('MT_NE');
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			await user.click(screen.getByTestId('load-entry'));

			expect(screen.getByTestId('migraine-panel')).toHaveClass('opacity-0', 'max-h-0');
		});

		it('closes panel and resets state when onClose is called', async () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			await user.click(screen.getByText('3'));

			expect(screen.getByTestId('migraine-panel')).toHaveClass('opacity-100');

			await user.click(screen.getByText('Close'));

			expect(screen.getByTestId('migraine-panel')).toHaveClass('opacity-0');
		});
	});

	describe('state dependency logic', () => {
		it('handles click on day correctly when calendarEvents is empty', async () => {
			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({
					calendarEvents: [],
				}),
			);

			render(<Calendar />);

			await user.click(screen.getByText('1'));

			expect(screen.getByTestId('migraine-panel')).toHaveClass('opacity-100', 'max-h-[2000px]');
		});

		it('keeps entry.medicines unchanged when userMedicineOptions is empty', async () => {
			vi.mocked(useCalendar).mockReturnValue(
				mockUseCalendar({
					userMedicineOptions: [],
				}),
			);

			render(<Calendar />);

			await user.click(screen.getByText('3'));

			expect(screen.getByTestId('migraine-panel')).toHaveClass('opacity-100', 'max-h-[2000px]');
		});
	});

	describe('visual behaviour', () => {
		it('displays correct date and prefilled in MigrainePanel', async () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			await user.click(screen.getByText('3'));

			expect(screen.getByLabelText('High')).toBeChecked();
		});

		it('disables MigrainePanel correctly depending on entry and isStoredEntryDisplaying', async () => {
			vi.mocked(useCalendar).mockReturnValue(mockUseCalendar());

			render(<Calendar />);

			await user.click(screen.getByText('3'));

			expect(screen.getByLabelText('High')).toBeDisabled();
		});
	});
});
