import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface ICardShell extends ComponentPropsWithoutRef<'div'> {
	children: ReactNode;
	padded?: boolean;
}

function CardShell({ children, padded = true, className = '', ...rest }: ICardShell) {
	return (
		<div
			className={`
	      w-full self-start rounded-2xl
	      bg-transparent backdrop-blur-md
	      border border-white/20
	      shadow-lg shadow-black/20
	      transition hover:shadow-xl
	      ${padded ? 'p-3 relative' : ''}
	      ${className}
      `}
			{...rest}
		>
			{children}
		</div>
	);
}

export default CardShell;
