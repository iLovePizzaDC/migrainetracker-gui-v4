import NavigationLink from '@/app/components/atoms/navigation/NavigationLink';
import { NAVIGATION_LINKS } from '@/app/constants/navigation/links';
import { useUser } from '@/shared/hooks/user/use-user';

export default function NavigationLinks() {
	const { user } = useUser();

	return (
		<>
			{NAVIGATION_LINKS.filter(({ allowAnonymous }) => allowAnonymous || user !== null).map(
				(navigationLink) => (
					<div key={`navigationlink-${navigationLink.to}`}>
						<NavigationLink label={navigationLink.label} to={navigationLink.to} />
					</div>
				),
			)}
		</>
	);
}
