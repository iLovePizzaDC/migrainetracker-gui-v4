import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface IMobileNavigationOptions {
	toggleMenu: () => void;
	isOpen: boolean;
}

export default function MobileNavigationOptions({ toggleMenu, isOpen }: IMobileNavigationOptions) {
	return (
		<button
			onClick={toggleMenu}
			className='text-white hover:text-gray-200 pl-6'
			data-testid='mobile-nav-toggle'
		>
			{isOpen ? <XMarkIcon data-testid='close-icon' /> : <Bars3Icon data-testid='open-icon' />}
		</button>
	);
}
