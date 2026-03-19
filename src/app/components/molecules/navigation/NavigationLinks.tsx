import NavigationLink from '@/app/components/atoms/navigation/NavigationLink';
import { NAVIGATION_LINKS } from '@/app/constants/navigation/links';

export default function NavigationLinks() {
	return (
		<>
			{NAVIGATION_LINKS.map((navigationLink) => (
				<div key={`navigationlink-${navigationLink.to}`}>
					<NavigationLink label={navigationLink.label} to={navigationLink.to} />
				</div>
			))}
		</>
	);
}
