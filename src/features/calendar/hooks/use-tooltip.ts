import { useEffect, useState, type RefObject } from 'react';

export function useTooltip(anchorRef: RefObject<HTMLSpanElement | null>, open: boolean) {
	const [coords, setCoords] = useState({ top: 0, left: 0 });

	useEffect(() => {
		if (!open) return;

		function updatePosition() {
			const anchor = anchorRef.current;

			if (!anchor) return;

			const rect = anchor.getBoundingClientRect();

			setCoords({
				top: rect.bottom + window.scrollY + 4,
				left: rect.left + window.scrollX + rect.width / 2,
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
