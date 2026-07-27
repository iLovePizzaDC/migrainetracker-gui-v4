import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ITooltip {
	content: ReactNode;
	children: ReactNode;
	className?: string;
}

// TODO refactor
function Tooltip({ content, children, className = '' }: ITooltip) {
	const [open, setOpen] = useState(false);
	const [coords, setCoords] = useState({ top: 0, left: 0 });
	const anchorRef = useRef<HTMLSpanElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);

	useClickOutside([anchorRef, popupRef], () => {
		setOpen(false);
	});

	useEffect(() => {
		if (!open || !anchorRef.current) return;

		function updatePosition() {
			const rect = anchorRef.current!.getBoundingClientRect();

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
	}, [open]);

	return (
		<span ref={anchorRef} className={`relative ${className}`}>
			<span
				role='button'
				tabIndex={0}
				onClick={(e) => {
					e.stopPropagation();
					setOpen((v) => !v);
				}}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.stopPropagation();
						e.preventDefault();
						setOpen((v) => !v);
					}
				}}
				className='cursor-pointer'
			>
				{children}
			</span>
			{open &&
				createPortal(
					<div
						ref={popupRef}
						role='tooltip'
						style={{
							top: coords.top,
							left: coords.left,
							position: 'absolute',
							transform: 'translateX(-50%)',
						}}
						className='z-50 min-w-max rounded-md border border-white/10 bg-neutral-900 px-2 py-1 text-[10px] text-white/80 shadow-lg shadow-black/40'
					>
						{content}
						<span className='absolute -top-1 left-1/2 -translate-x-1/2 block h-2 w-2 rotate-45 border-l border-t border-white/10 bg-neutral-900' />{' '}
					</div>,
					document.body,
				)}
		</span>
	);
}

export default Tooltip;
