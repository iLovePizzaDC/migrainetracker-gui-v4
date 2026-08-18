import {
	ITEM_HEIGHT,
	PICKER_HOURS,
	PICKER_MINUTES,
} from '@/features/calendar/constants/time-picker';
import type { PendingScroll } from '@/features/calendar/types/time-picker';
import { clamp } from '@/features/calendar/utils/scroll-snap-helper';
import { useCallback, useEffect, useRef } from 'react';

export function useScrollSnapPicker(open: boolean, selectedHour: string, selectedMinute: string) {
	const inputRef = useRef<HTMLInputElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);
	const hourRef = useRef<HTMLDivElement>(null);
	const minuteRef = useRef<HTMLDivElement>(null);
	const pendingByColumn = useRef(new Map<HTMLElement, PendingScroll>());
	const hourValueRef = useRef(selectedHour);
	const minuteValueRef = useRef(selectedMinute);

	useEffect(() => {
		hourValueRef.current = selectedHour;
		minuteValueRef.current = selectedMinute;
	}, [selectedHour, selectedMinute]);

	useEffect(() => {
		if (!open) return;

		const hIndex = PICKER_HOURS.indexOf(selectedHour);
		const mIndex = PICKER_MINUTES.indexOf(selectedMinute);
		const pending = pendingByColumn.current;

		if (hourRef.current && pending.get(hourRef.current)?.timeoutId == null) {
			hourRef.current.scrollTop = hIndex * ITEM_HEIGHT;
		}

		if (minuteRef.current && pending.get(minuteRef.current)?.timeoutId == null) {
			minuteRef.current.scrollTop = mIndex * ITEM_HEIGHT;
		}
	}, [open, selectedHour, selectedMinute]);

	useEffect(() => {
		const pending = pendingByColumn.current;

		return () => {
			for (const state of pending.values()) {
				if (state.timeoutId != null) {
					clearTimeout(state.timeoutId);
				}
			}
			pending.clear();
		};
	}, []);

	const composeTime = useCallback((patch: { hour?: string; minute?: string }) => {
		if (patch.hour !== undefined) hourValueRef.current = patch.hour;
		if (patch.minute !== undefined) minuteValueRef.current = patch.minute;
		return `${hourValueRef.current}:${minuteValueRef.current}`;
	}, []);

	const scrollToIndex = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {
		ref.current?.scrollTo({
			top: index * ITEM_HEIGHT,
			behavior: 'smooth',
		});
	};

	const handleScrollEnd = (el: HTMLDivElement, values: string[], onSelect: (v: string) => void) => {
		const index = clamp(Math.round(el.scrollTop / ITEM_HEIGHT), 0, values.length - 1);

		el.scrollTo({
			top: index * ITEM_HEIGHT,
			behavior: 'smooth',
		});

		onSelect(values[index]);
	};

	const handleScroll = (
		e: React.UIEvent<HTMLDivElement>,
		values: string[],
		onSelect: (v: string) => void,
	) => {
		inputRef.current?.blur();

		const el = e.currentTarget;
		const pending = pendingByColumn.current;
		const state = pending.get(el) ?? { timeoutId: null, flush: null };

		if (state.timeoutId != null) {
			clearTimeout(state.timeoutId);
		}

		state.flush = () => handleScrollEnd(el, values, onSelect);
		state.timeoutId = window.setTimeout(() => {
			state.timeoutId = null;
			const flush = state.flush;
			state.flush = null;
			flush?.();
		}, 80);

		pending.set(el, state);
	};

	const flushPendingScroll = () => {
		for (const state of pendingByColumn.current.values()) {
			if (state.timeoutId != null) {
				clearTimeout(state.timeoutId);
				state.timeoutId = null;
			}
			if (state.flush) {
				const flush = state.flush;
				state.flush = null;
				flush();
			}
		}
	};

	return {
		inputRef,
		pickerRef,
		hourRef,
		minuteRef,
		composeTime,
		scrollToIndex,
		handleScroll,
		flushPendingScroll,
	};
}
