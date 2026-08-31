import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface ICardShell extends ComponentPropsWithoutRef<'div'> {
	children: ReactNode;
	padded?: boolean;
}

function CardShell({ children, padded = true, className = '', ...rest }: ICardShell) {
	return (
		<div
			className={`
	      glass-panel min-w-0 w-full self-start
	      ${padded ? 'relative p-4 sm:p-5 md:p-6' : ''}
	      ${className}
      `}
			{...rest}
		>
			{children}
		</div>
	);
}

export default CardShell;
