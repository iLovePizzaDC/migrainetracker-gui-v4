import { useEffect, useState, type RefObject } from 'react';

const TOOLTIP_MAX_WIDTH = 320;
const VIEWPORT_PADDING = 16;

function clampHorizontalCenter(centerX: number) {
	const half = TOOLTIP_MAX_WIDTH / 2;
	const min = VIEWPORT_PADDING + half;
	const max = window.innerWidth - VIEWPORT_PADDING - half;

	if (max < min) {
		return window.innerWidth / 2;
	}

	return Math.max(min, Math.min(centerX, max));
}

export function useTooltip(anchorRef: RefObject<HTMLSpanElement | null>, open: boolean) {
	const [coords, setCoords] = useState({ top: 0, left: 0 });

	useEffect(() => {
		if (!open) return;

		function updatePosition() {
			const anchor = anchorRef.current;

			if (!anchor) return;

			const rect = anchor.getBoundingClientRect();
			const centerX = rect.left + window.scrollX + rect.width / 2;

			setCoords({
				top: rect.bottom + window.scrollY + 4,
				left: clampHorizontalCenter(centerX),
			});
		}

		updatePosition();

		window.addEventListener('scroll', updatePosition, true);
		window.addEventListener('resize', updatePosition);

		return () => {
			window.removeEventListener('scroll', updatePosition, true);
			window.removeEventListener('resize', updatePosition);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	return { coords };
}
