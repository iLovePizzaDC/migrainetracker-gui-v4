import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface IMobileNavigationOptions {
	toggleMenu: () => void;
	isOpen: boolean;
}

export default function MobileNavigationOptions({ toggleMenu, isOpen }: IMobileNavigationOptions) {
	return (
		<button
			onClick={toggleMenu}
			className='icon-btn'
			data-testid='mobile-nav-toggle'
			aria-label={isOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={isOpen}
		>
			{isOpen ? (
				<XMarkIcon data-testid='close-icon' />
			) : (
				<Bars3Icon data-testid='open-icon' />
			)}
		</button>
	);
}
