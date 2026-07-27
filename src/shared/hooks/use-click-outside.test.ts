import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { fireEvent, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('useClickOutside', () => {
	afterEach(() => vi.clearAllMocks());

	it('calls onOutsideClick when clicking outside the target', () => {
		const onOutsideClick = vi.fn();
		const div = document.createElement('div');
		document.body.appendChild(div);

		renderHook(() => {
			const ref = { current: div };
			useClickOutside(ref, onOutsideClick);
		});

		fireEvent.mouseDown(document.body);

		expect(onOutsideClick).toHaveBeenCalledTimes(1);
		document.body.removeChild(div);
	});

	it('does not call onOutsideClick when clicking inside the target', () => {
		const onOutsideClick = vi.fn();
		const div = document.createElement('div');
		document.body.appendChild(div);

		renderHook(() => {
			const ref = { current: div };
			useClickOutside(ref, onOutsideClick);
		});

		fireEvent.mouseDown(div);

		expect(onOutsideClick).not.toHaveBeenCalled();
		document.body.removeChild(div);
	});

	it('does not call onOutsideClick when clicking inside one of multiple refs', () => {
		const onOutsideClick = vi.fn();
		const div1 = document.createElement('div');
		const div2 = document.createElement('div');
		document.body.appendChild(div1);
		document.body.appendChild(div2);

		renderHook(() => {
			const ref1 = { current: div1 };
			const ref2 = { current: div2 };
			useClickOutside([ref1, ref2], onOutsideClick);
		});

		fireEvent.mouseDown(div2);

		expect(onOutsideClick).not.toHaveBeenCalled();
		document.body.removeChild(div1);
		document.body.removeChild(div2);
	});

	it('calls onOutsideClick when clicking outside all multiple refs', () => {
		const onOutsideClick = vi.fn();
		const div1 = document.createElement('div');
		const div2 = document.createElement('div');
		document.body.appendChild(div1);
		document.body.appendChild(div2);

		renderHook(() => {
			const ref1 = { current: div1 };
			const ref2 = { current: div2 };
			useClickOutside([ref1, ref2], onOutsideClick);
		});

		fireEvent.mouseDown(document.body);

		expect(onOutsideClick).toHaveBeenCalledTimes(1);
		document.body.removeChild(div1);
		document.body.removeChild(div2);
	});

	it('removes event listener on unmount', () => {
		const onOutsideClick = vi.fn();
		const div = document.createElement('div');
		document.body.appendChild(div);
		const removeSpy = vi.spyOn(document, 'removeEventListener');

		const { unmount } = renderHook(() => {
			const ref = { current: div };
			useClickOutside(ref, onOutsideClick);
		});

		unmount();

		expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
		document.body.removeChild(div);
	});
});
