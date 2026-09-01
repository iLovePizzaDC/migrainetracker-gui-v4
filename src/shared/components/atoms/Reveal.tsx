import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface IReveal extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
	open: boolean;
	children: ReactNode;
}

function Reveal({ open, children, className = '', ...rest }: IReveal) {
	return (
		<div
			className={`grid motion-reveal ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} ${className}`}
			{...rest}
		>
			<div className='min-h-0 overflow-hidden'>{children}</div>
		</div>
	);
}

export default Reveal;
