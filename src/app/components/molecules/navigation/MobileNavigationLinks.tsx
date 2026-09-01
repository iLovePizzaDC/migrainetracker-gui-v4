import NavigationLink from '@/app/components/atoms/NavigationLink';
import { NAVIGATION_LINKS } from '@/app/constants/navigation-links';
import { useUser } from '@/shared/hooks/use-user';

interface IMobileNavigationLinks {
	toggleMenu: () => void;
}

export default function MobileNavigationLinks({ toggleMenu }: IMobileNavigationLinks) {
	const { user } = useUser();

	return (
		<div className='flex flex-col gap-1'>
			{NAVIGATION_LINKS.filter(({ allowAnonymous }) => allowAnonymous || user !== null).map(
				(navigationLink) => (
					<NavigationLink
						key={`mobilenavigationlink-${navigationLink.to}`}
						label={navigationLink.label}
						to={navigationLink.to}
						onClick={toggleMenu}
						className='block w-full rounded-lg py-2.5 text-center text-sm'
					/>
				),
			)}
		</div>
	);
}
