import MobileNavigationLinks from '@/app/components/molecules/navigation/MobileNavigationLinks';
import MobileNavigationOptions from '@/app/components/molecules/navigation/MobileNavigationOptions';
import NavigationLinks from '@/app/components/molecules/navigation/NavigationLinks';
import Reveal from '@/shared/components/atoms/Reveal';
import { useUser } from '@/shared/hooks/use-user';
import { useState } from 'react';

function Navigation() {
	const { user } = useUser();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<header className='glass-chrome fixed left-0 top-0 z-30 w-full'>
			<div className='mx-auto flex min-h-14 max-w-7xl items-center justify-between px-4 py-3 sm:px-6'>
				<div className='flex min-w-0 flex-col items-start gap-0.5 text-left'>
					<span className='text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35'>
						MigraineTracker
					</span>
					<p className='truncate text-sm text-white/75'>
						{user ? `Sorry to see you, ${user.given_name}` : 'Welcome back'}
					</p>
				</div>

				<nav className='hidden lg:flex lg:items-center lg:gap-0.5' data-testid='desktop-nav'>
					<NavigationLinks />
				</nav>
				<div className='lg:hidden'>
					<MobileNavigationOptions toggleMenu={toggleMenu} isOpen={isOpen} />
				</div>
			</div>

			<Reveal open={isOpen} className='lg:hidden' data-testid='mobile-nav'>
				<nav className='mx-4 mb-3 rounded-xl border border-white/[0.08] bg-black/30 p-2 backdrop-blur-xl'>
					<MobileNavigationLinks toggleMenu={toggleMenu} />
				</nav>
			</Reveal>
		</header>
	);
}

export default Navigation;
