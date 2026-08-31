import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface ICardShell extends ComponentPropsWithoutRef<'div'> {
	children: ReactNode;
	padded?: boolean;
}

function CardShell({ children, padded = true, className = '', ...rest }: ICardShell) {
	return (
		<div
			className={`
	      glass-panel w-full self-start
	      ${padded ? 'relative p-5 sm:p-6' : ''}
	      ${className}
      `}
			{...rest}
		>
			{children}
		</div>
	);
}

export default CardShell;
