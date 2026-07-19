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
      <span
        className={`block transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90' : 'rotate-0'}`}
      >
        {isOpen ? (
          <XMarkIcon data-testid='close-icon' className='h-6 w-6' />
        ) : (
          <Bars3Icon data-testid='open-icon' className='h-6 w-6' />
        )}
      </span>
    </button>
  );
}
