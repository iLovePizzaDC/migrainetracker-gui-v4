import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTooltip } from '@/features/calendar/hooks/use-tooltip';

describe('useTooltip', () => {
	it('returns initial coordinates when tooltip is closed', () => {
		const anchorRef = { current: null };

		const { result } = renderHook(() => useTooltip(anchorRef, false));

		expect(result.current.coords).toEqual({
			top: 0,
			left: 0,
		});
	});

	it('calculates tooltip coordinates when opened', () => {
		const anchor = document.createElement('span');

		vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			bottom: 150,
			left: 200,
			width: 100,
			height: 50,
			right: 300,
			x: 200,
			y: 100,
			toJSON: () => {},
		});

		const anchorRef = { current: anchor };

		const { result } = renderHook(() => useTooltip(anchorRef, true));

		expect(result.current.coords).toEqual({
			top: 154,
			left: 250,
		});
	});

	it('updates coordinates on scroll', () => {
		const anchor = document.createElement('span');

		const getBoundingClientRect = vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			bottom: 150,
			left: 200,
			width: 100,
			height: 50,
			right: 300,
			x: 200,
			y: 100,
			toJSON: () => {},
		});

		const anchorRef = { current: anchor };

		const { result } = renderHook(() => useTooltip(anchorRef, true));

		expect(result.current.coords).toEqual({
			top: 154,
			left: 250,
		});

		getBoundingClientRect.mockReturnValue({
			top: 200,
			bottom: 250,
			left: 300,
			width: 200,
			height: 50,
			right: 500,
			x: 300,
			y: 200,
			toJSON: () => {},
		});

		act(() => {
			window.dispatchEvent(new Event('scroll'));
		});

		expect(result.current.coords).toEqual({
			top: 254,
			left: 400,
		});
	});

	it('updates coordinates on resize', () => {
		const anchor = document.createElement('span');

		const getBoundingClientRect = vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
			top: 100,
			bottom: 150,
			left: 200,
			width: 100,
			height: 50,
			right: 300,
			x: 200,
			y: 100,
			toJSON: () => {},
		});

		const anchorRef = { current: anchor };

		const { result } = renderHook(() => useTooltip(anchorRef, true));

		getBoundingClientRect.mockReturnValue({
			top: 300,
			bottom: 350,
			left: 400,
			width: 200,
			height: 50,
			right: 600,
			x: 400,
			y: 300,
			toJSON: () => {},
		});

		act(() => {
			window.dispatchEvent(new Event('resize'));
		});

		expect(result.current.coords).toEqual({
			top: 354,
			left: 500,
		});
	});

	it('does not calculate coordinates when closed', () => {
		const anchor = document.createElement('span');
		const getBoundingClientRect = vi.spyOn(anchor, 'getBoundingClientRect');

		const anchorRef = { current: anchor };

		renderHook(() => useTooltip(anchorRef, false));

		expect(getBoundingClientRect).not.toHaveBeenCalled();
	});
});
