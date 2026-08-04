import { useClickOutside } from '@/shared/hooks/use-click-outside';
import { useCallback, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTooltip } from '@/features/calendar/hooks/use-tooltip';

interface ITooltip {
	content: ReactNode;
	children: ReactNode;
	className?: string;
}

function Tooltip({ content, children, className = '' }: ITooltip) {
	const anchorRef = useRef<HTMLSpanElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);

	const [open, setOpen] = useState(false);

	const { coords } = useTooltip(anchorRef, open);

	useClickOutside([anchorRef, popupRef], () => {
		setOpen(false);
	});

	const handleClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		setOpen((v) => !v);
	}, []);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.stopPropagation();
			e.preventDefault();
			setOpen((v) => !v);
		}
	}, []);

	const popupStyle = useMemo<CSSProperties>(
		() => ({
			top: coords.top,
			left: coords.left,
			position: 'absolute',
			transform: 'translateX(-50%)',
		}),
		[coords.top, coords.left],
	);

	return (
		<span ref={anchorRef} className={`relative ${className}`}>
			<span
				role='button'
				tabIndex={0}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				className='cursor-pointer'
			>
				{children}
			</span>
			{open &&
				createPortal(
					<div
						ref={popupRef}
						role='tooltip'
						style={popupStyle}
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
