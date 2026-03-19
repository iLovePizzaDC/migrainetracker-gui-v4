import NavigationLink from '@/app/components/atoms/navigation/NavigationLink';
import { NAVIGATION_LINKS } from '@/app/constants/navigation/links';

interface IMobileNavigationLinks {
	toggleMenu: () => void;
}

export default function MobileNavigationLinks({ toggleMenu }: IMobileNavigationLinks) {
	return (
		<div className='space-y-3'>
			{NAVIGATION_LINKS.map((navigationLink) => (
				<div key={`mobilenavigationlink-${navigationLink.to}`}>
					<NavigationLink
						label={navigationLink.label}
						to={navigationLink.to}
						onClick={toggleMenu}
						className='block text-sm pl-4 p-2 rounded-full'
					/>
				</div>
			))}
		</div>
	);
}
