import {
	ITEM_HEIGHT,
	PICKER_HOURS,
	PICKER_MINUTES,
} from '@/features/calendar/constants/time-picker';
import { useScrollSnapPicker } from '@/features/calendar/hooks/use-scroll-snap-picker';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useScrollSnapPicker', () => {
	beforeEach(() => {
		vi.useRealTimers();
	});

	it('sets initial scroll position when opened', () => {
		const hour = '10';
		const minute = '30';

		const { result, rerender } = renderHook(({ open, h, m }) => useScrollSnapPicker(open, h, m), {
			initialProps: { open: false, h: hour, m: minute },
		});

		const hourEl = document.createElement('div');
		const minuteEl = document.createElement('div');

		result.current.hourRef.current = hourEl;
		result.current.minuteRef.current = minuteEl;

		rerender({ open: true, h: hour, m: minute });

		const hIndex = PICKER_HOURS.indexOf(hour);
		const mIndex = PICKER_MINUTES.indexOf(minute);

		expect(hourEl.scrollTop).toBe(hIndex * ITEM_HEIGHT);
		expect(minuteEl.scrollTop).toBe(mIndex * ITEM_HEIGHT);
	});

	it('scrolls to correct index', () => {
		const { result } = renderHook(() => useScrollSnapPicker(false, '00', '00'));

		const el = document.createElement('div');
		el.scrollTo = vi.fn();

		const ref = { current: el };

		result.current.scrollToIndex(ref, 3);

		expect(el.scrollTo).toHaveBeenCalledWith({
			top: 3 * ITEM_HEIGHT,
			behavior: 'smooth',
		});
	});

	it('calls onSelect with snapped value after scroll', async () => {
		vi.useFakeTimers();

		const onSelect = vi.fn();

		const { result } = renderHook(() => useScrollSnapPicker(false, '00', '00'));

		const el = document.createElement('div');
		el.scrollTop = 85;
		el.scrollTo = vi.fn();

		const event = {
			currentTarget: el,
		} as React.UIEvent<HTMLDivElement>;

		act(() => {
			result.current.handleScroll(event, ['00', '01', '02', '03'], onSelect);
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(onSelect).toHaveBeenCalled();
		expect(el.scrollTo).toHaveBeenCalled();
	});

	it('blurs input on scroll', () => {
		const { result } = renderHook(() => useScrollSnapPicker(false, '00', '00'));

		const input = document.createElement('input');
		input.blur = vi.fn();

		result.current.inputRef.current = input;

		const el = document.createElement('div');

		const event = {
			currentTarget: el,
		} as React.UIEvent<HTMLDivElement>;

		result.current.handleScroll(event, ['00'], vi.fn());

		expect(input.blur).toHaveBeenCalled();
	});

	it('updates scroll position when selectedHour/Minute change', () => {
		const { result, rerender } = renderHook(({ open, h, m }) => useScrollSnapPicker(open, h, m), {
			initialProps: { open: true, h: '01', m: '05' },
		});

		const hourEl = document.createElement('div');
		const minuteEl = document.createElement('div');
		result.current.hourRef.current = hourEl;
		result.current.minuteRef.current = minuteEl;

		rerender({ open: true, h: '02', m: '10' });

		expect(hourEl.scrollTop).toBe(PICKER_HOURS.indexOf('02') * ITEM_HEIGHT);
		expect(minuteEl.scrollTop).toBe(PICKER_MINUTES.indexOf('10') * ITEM_HEIGHT);
	});

	it('pickerRef exists but does not crash', () => {
		const { result } = renderHook(() => useScrollSnapPicker(false, '00', '00'));
		const picker = document.createElement('div');
		result.current.pickerRef.current = picker;

		expect(result.current.pickerRef.current).toBe(picker);
	});

	it('commits hour and minute independently when both columns scroll', () => {
		vi.useFakeTimers();

		const onSelectHour = vi.fn();
		const onSelectMinute = vi.fn();
		const { result } = renderHook(() => useScrollSnapPicker(false, '00', '00'));

		const hourEl = document.createElement('div');
		const minuteEl = document.createElement('div');
		hourEl.scrollTop = 3 * ITEM_HEIGHT;
		minuteEl.scrollTop = 2 * ITEM_HEIGHT;
		hourEl.scrollTo = vi.fn();
		minuteEl.scrollTo = vi.fn();

		act(() => {
			result.current.handleScroll(
				{ currentTarget: hourEl } as React.UIEvent<HTMLDivElement>,
				PICKER_HOURS,
				onSelectHour,
			);
			result.current.handleScroll(
				{ currentTarget: minuteEl } as React.UIEvent<HTMLDivElement>,
				PICKER_MINUTES,
				onSelectMinute,
			);
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(onSelectHour).toHaveBeenCalled();
		expect(onSelectMinute).toHaveBeenCalled();
	});

	it('does not reset hour scroll while that column is still scrolling', () => {
		vi.useFakeTimers();

		const { result, rerender } = renderHook(({ open, h, m }) => useScrollSnapPicker(open, h, m), {
			initialProps: { open: true, h: '01', m: '05' },
		});

		const hourEl = document.createElement('div');
		const minuteEl = document.createElement('div');
		result.current.hourRef.current = hourEl;
		result.current.minuteRef.current = minuteEl;

		const userHourScroll = 5 * ITEM_HEIGHT;
		hourEl.scrollTop = userHourScroll;

		act(() => {
			result.current.handleScroll(
				{ currentTarget: hourEl } as React.UIEvent<HTMLDivElement>,
				PICKER_HOURS,
				vi.fn(),
			);
		});

		rerender({ open: true, h: '01', m: '10' });

		expect(hourEl.scrollTop).toBe(userHourScroll);
	});

	it('composeTime keeps the latest hour and minute together', () => {
		const { result } = renderHook(() => useScrollSnapPicker(false, '10', '00'));

		let time = '';
		act(() => {
			time = result.current.composeTime({ hour: '15' });
		});
		expect(time).toBe('15:00');

		act(() => {
			time = result.current.composeTime({ minute: '30' });
		});
		expect(time).toBe('15:30');
	});

	it('flushPendingScroll commits both columns', () => {
		vi.useFakeTimers();

		const onSelectHour = vi.fn();
		const onSelectMinute = vi.fn();
		const { result } = renderHook(() => useScrollSnapPicker(false, '00', '00'));

		const hourEl = document.createElement('div');
		const minuteEl = document.createElement('div');
		hourEl.scrollTop = ITEM_HEIGHT;
		minuteEl.scrollTop = ITEM_HEIGHT;
		hourEl.scrollTo = vi.fn();
		minuteEl.scrollTo = vi.fn();

		act(() => {
			result.current.handleScroll(
				{ currentTarget: hourEl } as React.UIEvent<HTMLDivElement>,
				PICKER_HOURS,
				onSelectHour,
			);
			result.current.handleScroll(
				{ currentTarget: minuteEl } as React.UIEvent<HTMLDivElement>,
				PICKER_MINUTES,
				onSelectMinute,
			);
		});

		act(() => {
			result.current.flushPendingScroll();
		});

		expect(onSelectHour).toHaveBeenCalled();
		expect(onSelectMinute).toHaveBeenCalled();
	});
});
