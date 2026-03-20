import NavigationLinks from '@/app/components/molecules/navigation/NavigationLinks';
import { NAVIGATION_LINKS } from '@/app/constants/navigation/links';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', () => ({
	useLocation: () => ({ pathname: '/' }),
	Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('<NavigationLinks />', () => {
	it('renders a link for each navigation item', () => {
		render(<NavigationLinks />);

		for (const link of NAVIGATION_LINKS) {
			expect(screen.getByText(link.label)).toBeInTheDocument();
		}
	});
});
