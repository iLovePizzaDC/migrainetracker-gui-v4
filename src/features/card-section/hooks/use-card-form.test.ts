import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCardForm } from '@/features/card-section/hooks/use-card-form';
import { TIME_FRAME_UNITS } from '@/shared/constants/event/card';
import type { EventFilter } from '@/shared/types/event';
import { INTENSITY_TYPES, SYMPTOM_TYPES } from '@/shared/constants/event/event-details';
import { CARD_TYPES, CHART_TYPES } from '../constants/card';

const defaultFilter: EventFilter = {
	intensity: null,
	symptom: [],
	medicine: [],
	effectiveness: null,
	midas: [],
};

const defaults = {
	title: 'Default title',
	cardType: CARD_TYPES.MIGRAINE,
	chartType: CHART_TYPES.AREA,
	filter: defaultFilter,
	count: 12,
	unit: TIME_FRAME_UNITS.MONTHS,
};

describe('useCardForm', () => {
	it('initializes form state from defaults', () => {
		const { result } = renderHook(() => useCardForm(defaults));

		expect(result.current.form).toEqual({
			title: 'Default title',
			cardType: CARD_TYPES.MIGRAINE,
			chartType: CHART_TYPES.AREA,
			filter: defaultFilter,
			timeframe: { count: 12, unit: TIME_FRAME_UNITS.MONTHS },
		});
	});

	it('updates title via setTitle', () => {
		const { result } = renderHook(() => useCardForm(defaults));

		act(() => result.current.setTitle('New title'));

		expect(result.current.form.title).toBe('New title');
	});

	it('updates cardType via setCardType', () => {
		const { result } = renderHook(() => useCardForm(defaults));

		act(() => result.current.setCardType(CARD_TYPES.DURATION));

		expect(result.current.form.cardType).toBe(CARD_TYPES.DURATION);
	});

	it('updates chartType via setChartType', () => {
		const { result } = renderHook(() => useCardForm(defaults));

		act(() => result.current.setChartType(CHART_TYPES.PIE));

		expect(result.current.form.chartType).toBe(CHART_TYPES.PIE);
	});

	it('updates timeframe.count via setCount without touching unit', () => {
		const { result } = renderHook(() => useCardForm(defaults));

		act(() => result.current.setCount(7));

		expect(result.current.form.timeframe).toEqual({ count: 7, unit: TIME_FRAME_UNITS.MONTHS });
	});

	it('updates timeframe.unit via setUnit without touching count', () => {
		const { result } = renderHook(() => useCardForm(defaults));

		act(() => result.current.setUnit(TIME_FRAME_UNITS.DAYS));

		expect(result.current.form.timeframe).toEqual({ count: 12, unit: TIME_FRAME_UNITS.DAYS });
	});

	it('updates filter via setFilter with a direct value', () => {
		const { result } = renderHook(() => useCardForm(defaults));
		const newFilter: EventFilter = { ...defaultFilter, intensity: INTENSITY_TYPES.HIGH };

		act(() => result.current.setFilter(newFilter));

		expect(result.current.form.filter).toEqual(newFilter);
	});

	it('updates filter via setFilter with an updater function', () => {
		const { result } = renderHook(() => useCardForm(defaults));

		act(() => result.current.setFilter((prev) => ({ ...prev, symptom: [SYMPTOM_TYPES.NAUSEA] })));

		expect(result.current.form.filter.symptom).toEqual([SYMPTOM_TYPES.NAUSEA]);
	});

	it('resets form back to defaults after changes', () => {
		const { result } = renderHook(() => useCardForm(defaults));

		act(() => {
			result.current.setTitle('Changed');
			result.current.setCardType(CARD_TYPES.MOH);
			result.current.setCount(99);
		});
		act(() => result.current.reset());

		expect(result.current.form).toEqual({
			title: 'Default title',
			cardType: CARD_TYPES.MIGRAINE,
			chartType: CHART_TYPES.AREA,
			filter: defaultFilter,
			timeframe: { count: 12, unit: TIME_FRAME_UNITS.MONTHS },
		});
	});

	it('buildSetup returns a CardSetup with the given index and current form values', () => {
		const { result } = renderHook(() => useCardForm(defaults));

		act(() => result.current.setTitle('Test title'));

		expect(result.current.buildSetup(3)).toEqual({
			index: 3,
			title: 'Test title',
			cardType: CARD_TYPES.MIGRAINE,
			chartType: CHART_TYPES.AREA,
			filter: defaultFilter,
			timeframe: { count: 12, unit: TIME_FRAME_UNITS.MONTHS },
		});
	});
});
