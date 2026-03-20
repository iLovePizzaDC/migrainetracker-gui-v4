import Navigation from '@/app/components/organisms/Navigation';
import { useUser } from '@/shared/hooks/user/use-user';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/user/use-user');
vi.mock('@/app/components/molecules/navigation/NavigationLinks', () => ({
	default: () => <div data-testid='navigation-links' />,
}));
vi.mock('@/app/components/molecules/navigation/MobileNavigationLinks', () => ({
	default: ({ toggleMenu }: any) => (
		<div data-testid='mobile-navigation-links' onClick={toggleMenu} />
	),
}));
vi.mock('@/app/components/molecules/navigation/MobileNavigationOptions', () => ({
	default: ({ toggleMenu, isOpen }: any) => (
		<button data-testid='mobile-nav-toggle' onClick={toggleMenu}>
			{isOpen ? 'close' : 'open'}
		</button>
	),
}));

describe('<Navigation />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		vi.mocked(useUser).mockReturnValue({ user: null } as any);
	});

	afterEach(() => vi.clearAllMocks());

	describe('rendering', () => {
		it('renders greeting without name when user is null', () => {
			render(<Navigation />);
			expect(screen.getByText('Sorry to see you')).toBeInTheDocument();
		});

		it('renders greeting with name when user is set', () => {
			vi.mocked(useUser).mockReturnValue({
				user: { given_name: 'Nico' },
			} as any);

			render(<Navigation />);
			expect(screen.getByText('Sorry to see you, Nico')).toBeInTheDocument();
		});

		it('renders desktop nav', () => {
			render(<Navigation />);
			expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
		});

		it('renders mobile nav closed by default', () => {
			render(<Navigation />);
			expect(screen.getByTestId('mobile-nav')).toHaveClass('max-h-0', 'opacity-0');
		});
	});

	describe('mobile menu toggle', () => {
		it('opens mobile nav on toggle click', async () => {
			render(<Navigation />);

			await user.click(screen.getByTestId('mobile-nav-toggle'));

			expect(screen.getByTestId('mobile-nav')).toHaveClass('max-h-60', 'opacity-100');
		});

		it('closes mobile nav on second toggle click', async () => {
			render(<Navigation />);

			await user.click(screen.getByTestId('mobile-nav-toggle'));
			await user.click(screen.getByTestId('mobile-nav-toggle'));

			expect(screen.getByTestId('mobile-nav')).toHaveClass('max-h-0', 'opacity-0');
		});
	});
});
