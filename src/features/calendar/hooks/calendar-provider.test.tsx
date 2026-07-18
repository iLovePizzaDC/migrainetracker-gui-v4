import type { STRENGTH_MAP } from '@/features/calendar/constants/calendar';
import {
	CalendarContext,
	type ICalendarContext,
} from '@/features/calendar/context/calendar-context';
import { CalendarProvider } from '@/features/calendar/hooks/calendar-provider';
import { useCalendarDate } from '@/features/calendar/hooks/use-calendar-date';
import { useCalendarEvents } from '@/features/calendar/hooks/use-calendar-events';
import { useMedDays } from '@/features/calendar/hooks/use-med-days';
import type { MigraineEvent } from '@/features/calendar/types/event';
import {
	EFFECTIVENESS_TYPES,
	INTENSITY_TYPES,
	SYMPTOM_TYPES,
} from '@/shared/constants/event/event-details';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import { act, render, renderHook, screen } from '@testing-library/react';
import { useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/features/calendar/hooks/use-calendar-date');
vi.mock('@/features/calendar/hooks/use-calendar-events');
vi.mock('@/features/calendar/hooks/use-med-days');
vi.mock('@/shared/hooks/user/use-user', () => ({
	useUser: () => ({
		medicines: mockUserMedicines,
	}),
}));

const mockMedLabel = 'test medicine';
const mockMedValue = 'tst_med';

const mockUserMedicines = [
	{
		name: `${mockMedLabel} 1`,
		abbreviation: `${mockMedValue}_1`,
		type: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
	},
	{
		name: `${mockMedLabel} 2`,
		abbreviation: `${mockMedValue}_2`,
		type: MEDICINE_TYPES.PAINKILLER,
	},
];

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
		medicine: mockMedValue,
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
	setMonth: vi.fn(),
	prevMonth: vi.fn(),
	nextMonth: vi.fn(),
};

const defaultCalendarEvents = {
	calendarEvents: [] as MigraineEvent[],
	filteredEvents: [] as MigraineEvent[],
	migrainosusFlags: [] as boolean[],
	filter: {
		intensity: null,
		symptom: [],
		medicine: [],
		effectiveness: null,
		midas: [],
	},
	setFilter: vi.fn(),
	isLoading: false,
	refetchEvents: vi.fn().mockResolvedValue(undefined),
};

const defaultMedDays = {
	medDaysCount: 3,
	maxMedDaysCount: 10,
	collectMedDays: vi.fn().mockResolvedValue(undefined),
};

function setupMocks(
	overrides: {
		calendarDate?: Partial<typeof defaultCalendarDate>;
		calendarEvents?: Partial<typeof defaultCalendarEvents>;
		medDays?: Partial<typeof defaultMedDays>;
	} = {},
) {
	vi.mocked(useCalendarDate).mockReturnValue({
		...defaultCalendarDate,
		...overrides.calendarDate,
	});
	vi.mocked(useCalendarEvents).mockReturnValue({
		...defaultCalendarEvents,
		...overrides.calendarEvents,
	});
	vi.mocked(useMedDays).mockReturnValue({ ...defaultMedDays, ...overrides.medDays });
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

		it('forwards setMonth, prevMonth, nextMonth from useCalendarDate', () => {
			const result = renderWithProvider();

			result.current.setMonth(new Date('2026-06-01'));
			result.current.prevMonth();
			result.current.nextMonth();

			expect(defaultCalendarDate.setMonth).toHaveBeenCalledWith(new Date('2026-06-01'));
			expect(defaultCalendarDate.prevMonth).toHaveBeenCalledTimes(1);
			expect(defaultCalendarDate.nextMonth).toHaveBeenCalledTimes(1);
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

			expect(defaultCalendarEvents.setFilter).toHaveBeenCalledWith(newFilter);
		});
	});

	describe('refetchEvents', () => {
		it('refetchEvents calls the hook refetchEvents function', async () => {
			const result = renderWithProvider();

			await act(async () => {
				await result.current.refetchEvents();
			});

			expect(defaultCalendarEvents.refetchEvents).toHaveBeenCalledTimes(1);
		});
	});

	describe('collectMedDays', () => {
		it('collectMedDays calls the hook collectMedDays function', async () => {
			const result = renderWithProvider();

			await act(async () => {
				await result.current.collectMedDays();
			});

			expect(defaultMedDays.collectMedDays).toHaveBeenCalled();
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

	describe('hook arguments', () => {
		it('passes firstDayOfMonth, lastDayOfMonth, daysInMonth to useCalendarEvents', () => {
			renderWithProvider();

			expect(vi.mocked(useCalendarEvents)).toHaveBeenCalledWith(
				defaultCalendarDate.firstDayOfMonth,
				defaultCalendarDate.lastDayOfMonth,
				defaultCalendarDate.daysInMonth,
			);
		});

		it('passes currentDate to useMedDays', () => {
			renderWithProvider();

			expect(vi.mocked(useMedDays)).toHaveBeenCalledWith(defaultCalendarDate.currentDate);
		});
	});
});
