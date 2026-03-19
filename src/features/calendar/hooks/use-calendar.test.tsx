import {
	CalendarContext,
	type ICalendarContext,
} from '@/features/calendar/context/calendar-context';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

const fakeContext: ICalendarContext = {
	isLoading: false,
	date: new Date('2026-01-01'),
	daysArray: [],
	month: 'January',
	year: 2026,
	setMonth: () => {},
	prevMonth: () => {},
	nextMonth: () => {},
	refetchEvents: async () => {},
	collectMedDays: async () => {},
	loadUserMedicines: async () => {},
	calendarEvents: [],
	filteredEvents: [],
	medDaysCount: 3,
	maxMedDaysCount: 10,
	migrainosusFlags: [],
	userMedicineOptions: [],
	filter: {
		intensity: null,
		symptom: [],
		medicine: [],
		effectiveness: null,
		midas: [],
	},
	setFilter: () => {},
};

describe('useCalendar', () => {
	it('returns context when used inside provider', () => {
		const { result } = renderHook(() => useCalendar(), {
			wrapper: ({ children }: React.PropsWithChildren) => (
				<CalendarContext.Provider value={fakeContext}>{children}</CalendarContext.Provider>
			),
		});

		expect(result.current).toBe(fakeContext);
	});

	it('throws error when used outside provider', () => {
		const callHook = () => {
			renderHook(() => useCalendar());
		};

		expect(callHook).toThrowError('useCalendar must be used within a CalendarProvider');
	});
});
