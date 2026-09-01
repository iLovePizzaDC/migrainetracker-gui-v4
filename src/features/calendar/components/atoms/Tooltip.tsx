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
				aria-expanded={open}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				className='tooltip-trigger'
			>
				{children}
			</span>
			{open &&
				typeof document !== 'undefined' &&
				createPortal(
					<div ref={popupRef} role='tooltip' style={popupStyle} className='tooltip-panel'>
						{content}
						<span className='tooltip-arrow' aria-hidden='true' />
					</div>,
					document.body,
				)}
		</span>
	);
}

export default Tooltip;
