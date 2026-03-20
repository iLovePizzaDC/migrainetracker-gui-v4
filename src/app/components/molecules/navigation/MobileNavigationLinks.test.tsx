import MobileNavigationLinks from '@/app/components/molecules/navigation/MobileNavigationLinks';
import { NAVIGATION_LINKS } from '@/app/constants/navigation/links';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router-dom', () => ({
	useLocation: () => ({ pathname: '/' }),
	Link: ({ children, href, onClick }: any) => (
		<a href={href} onClick={onClick}>
			{children}
		</a>
	),
}));

describe('<MobileNavigationLinks />', () => {
	const user = userEvent.setup();
	const defaultProps = { toggleMenu: vi.fn() };

	it('renders a link for each navigation item', () => {
		render(<MobileNavigationLinks {...defaultProps} />);

		for (const link of NAVIGATION_LINKS) {
			expect(screen.getByText(link.label)).toBeInTheDocument();
		}
	});

	it('calls toggleMenu when a link is clicked', async () => {
		const mockToggleMenu = vi.fn();
		render(<MobileNavigationLinks toggleMenu={mockToggleMenu} />);

		await user.click(screen.getByText(NAVIGATION_LINKS[0].label));

		expect(mockToggleMenu).toHaveBeenCalled();
	});
});
