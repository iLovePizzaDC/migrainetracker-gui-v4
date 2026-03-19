import type { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import {
	CalendarContext,
	type ICalendarContext,
} from '@/features/calendar/context/calendar-context';
import { CalendarProvider } from '@/features/calendar/hooks/calendar-provider';
import { useCalendarDate } from '@/features/calendar/hooks/use-calendar-date';
import { useCalendarEvents } from '@/features/calendar/hooks/use-calendar-events';
import { useMedDays } from '@/features/calendar/hooks/use-med-days';
import type { Event } from '@/features/calendar/types/event';
import {
	EFFECTIVENESS_TYPES,
	INTENSITY_TYPES,
	SYMPTOM_TYPES,
} from '@/shared/constants/event/event-details';
import { useUserMedicines } from '@/shared/hooks/user/use-user-medicines';
import type { DropdownOption } from '@/shared/types/input/input';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-calendar-date');
vi.mock('@/features/calendar/hooks/use-calendar-events');
vi.mock('@/features/calendar/hooks/use-med-days');
vi.mock('@/shared/hooks/user/use-user-medicines');

const mockSetMonth = vi.fn();
const mockPrevMonth = vi.fn();
const mockNextMonth = vi.fn();
const mockRefetchEvents = vi.fn().mockResolvedValue(undefined);
const mockCollectMedDays = vi.fn().mockResolvedValue(undefined);
const mockLoadUserMedicines = vi.fn().mockResolvedValue(undefined);
const mockSetFilter = vi.fn();

const mockMedLabel = 'test medicine';
const mockMedValue = 'tst_med';
const mockUserMedicine = {
	label: `${mockMedLabel} 1`,
	value: `${mockMedValue}_1`,
};

const mockEvent = {
	date: new Date('2026-01-03'),
	description: {
		duration: [
			{
				start: 10,
				end: 15,
			},
		],
		intensity: INTENSITY_TYPES.HIGH,
		symptoms: [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT, SYMPTOM_TYPES.SMELL],
		medicine: mockUserMedicine.value,
		effectiveness: [EFFECTIVENESS_TYPES.EFFECTIVE],
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

const defaultCalendarDate = {
	currentDate: new Date('2026-05-01'),
	firstDayOfMonth: new Date('2026-05-01'),
	lastDayOfMonth: new Date('2026-05-31'),
	daysArray: [null, null, null, 1, 2, 3],
	daysInMonth: 31,
	month: 'May',
	year: 2026,
	setMonth: mockSetMonth,
	prevMonth: mockPrevMonth,
	nextMonth: mockNextMonth,
};

const defaultCalendarEvents = {
	calendarEvents: [] as Event[],
	filteredEvents: [] as Event[],
	migrainosusFlags: [] as boolean[],
	filter: {
		intensity: null,
		symptom: [],
		medicine: [],
		effectiveness: null,
		midas: [],
	},
	setFilter: mockSetFilter,
	isLoading: false,
	refetchEvents: mockRefetchEvents,
};

const defaultMedDays = {
	medDaysCount: 3,
	maxMedDaysCount: 10,
	collectMedDays: mockCollectMedDays,
};

const defaultUserMedicines = {
	userMedicineOptions: [] as DropdownOption[],
	loadUserMedicines: mockLoadUserMedicines,
};

function setupMocks(
	overrides: {
		calendarDate?: Partial<typeof defaultCalendarDate>;
		calendarEvents?: Partial<typeof defaultCalendarEvents>;
		medDays?: Partial<typeof defaultMedDays>;
		userMedicines?: Partial<typeof defaultUserMedicines>;
	} = {},
) {
	vi.mocked(useCalendarDate).mockReturnValue({ ...defaultCalendarDate, ...overrides.calendarDate });
	vi.mocked(useCalendarEvents).mockReturnValue({
		...defaultCalendarEvents,
		...overrides.calendarEvents,
	});
	vi.mocked(useMedDays).mockReturnValue({ ...defaultMedDays, ...overrides.medDays });
	vi.mocked(useUserMedicines).mockReturnValue({
		...defaultUserMedicines,
		...overrides.userMedicines,
	});
}

function renderWithProvider() {
	const { result } = renderHook(() => useContext(CalendarContext), {
		wrapper: ({ children }) => <CalendarProvider>{children}</CalendarProvider>,
	});
	return result as { current: ICalendarContext };
}

describe('CalendarProvider', () => {
	beforeEach(() => setupMocks());
	afterEach(() => vi.clearAllMocks());

	describe('context values', () => {
		it('provides date values from useCalendarDate', () => {
			const result = renderWithProvider();

			expect(result.current.date).toEqual(new Date('2026-05-01'));
			expect(result.current.month).toBe('May');
			expect(result.current.year).toBe(2026);
			expect(result.current.daysArray).toEqual([null, null, null, 1, 2, 3]);
		});

		it('provides event values from useCalendarEvents', () => {
			setupMocks({ calendarEvents: { calendarEvents: [mockEvent], isLoading: true } });

			const result = renderWithProvider();

			expect(result.current.calendarEvents).toEqual([mockEvent]);
			expect(result.current.isLoading).toBe(true);
		});

		it('provides medDaysCount and maxMedDaysCount from useMedDays', () => {
			setupMocks({ medDays: { medDaysCount: 7, maxMedDaysCount: 15 } });

			const result = renderWithProvider();

			expect(result.current.medDaysCount).toBe(7);
			expect(result.current.maxMedDaysCount).toBe(15);
		});

		it('provides userMedicineOptions from useUserMedicines', () => {
			setupMocks({ userMedicines: { userMedicineOptions: [mockUserMedicine] } });

			const result = renderWithProvider();

			expect(result.current.userMedicineOptions).toEqual([mockUserMedicine]);
		});

		it('forwards setMonth, prevMonth, nextMonth from useCalendarDate', () => {
			const result = renderWithProvider();

			result.current.setMonth(new Date('2026-06-01'));
			result.current.prevMonth();
			result.current.nextMonth();

			expect(mockSetMonth).toHaveBeenCalledWith(new Date('2026-06-01'));
			expect(mockPrevMonth).toHaveBeenCalledTimes(1);
			expect(mockNextMonth).toHaveBeenCalledTimes(1);
		});

		it('forwards setFilter from useCalendarEvents', () => {
			const result = renderWithProvider();
			const newFilter = {
				intensity: INTENSITY_TYPES.HIGH,
				symptom: [],
				medicine: [],
				effectiveness: null,
				midas: [],
			};

			result.current.setFilter(newFilter);

			expect(mockSetFilter).toHaveBeenCalledWith(newFilter);
		});
	});

	describe('refetchEvents', () => {
		it('refetchEvents calls _refetchEvents and collectMedDays', async () => {
			const result = renderWithProvider();

			await act(async () => {
				await result.current.refetchEvents();
			});

			expect(mockRefetchEvents).toHaveBeenCalledTimes(1);
			expect(mockCollectMedDays).toHaveBeenCalled();
		});

		it('refetchEvents calls _refetchEvents before collectMedDays', async () => {
			const order: string[] = [];
			mockRefetchEvents.mockImplementation(async () => {
				order.push('refetch');
			});
			mockCollectMedDays.mockImplementation(async () => {
				order.push('collect');
			});

			const result = renderWithProvider();

			await act(async () => {
				await result.current.refetchEvents();
			});

			expect(order).toEqual(['collect', 'refetch', 'collect']);
		});
	});

	describe('useEffect', () => {
		it('calls collectMedDays on mount', async () => {
			renderWithProvider();

			await waitFor(() => expect(mockCollectMedDays).toHaveBeenCalledTimes(1));
		});
	});

	describe('children', () => {
		it('renders children', () => {
			render(
				<CalendarProvider>
					<span>test-child</span>
				</CalendarProvider>,
			);

			expect(screen.getByText('test-child')).toBeInTheDocument();
		});
	});

	describe('useCalendarEvents args', () => {
		it('passes firstDayOfMonth, lastDayOfMonth, daysInMonth to useCalendarEvents', () => {
			renderWithProvider();

			expect(useCalendarEvents).toHaveBeenCalledWith(
				defaultCalendarDate.firstDayOfMonth,
				defaultCalendarDate.lastDayOfMonth,
				defaultCalendarDate.daysInMonth,
			);
		});
	});

	describe('useMedDays args', () => {
		it('passes currentDate to useMedDays', () => {
			renderWithProvider();

			expect(useMedDays).toHaveBeenCalledWith(defaultCalendarDate.currentDate);
		});
	});
});
