import { useEffect } from 'react';

export function useClickOutside(
	targetRefs: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[],
	onOutsideClick: () => void,
) {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const refs = Array.isArray(targetRefs) ? targetRefs : [targetRefs];

			const clickedInside = refs.some(
				(ref) => ref.current && ref.current.contains(event.target as Node),
			);

			if (!clickedInside) {
				onOutsideClick();
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [targetRefs, onOutsideClick]);
}
