import LoginButton from '@/features/landing-page/components/atoms/LoginButton';
import { fetchOAuthAccessToken } from '@/shared/api/google.api';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/google.api', () => ({
	fetchOAuthAccessToken: vi.fn(() => 'https://auth.example.com'),
}));

describe('<LoginButton />', () => {
	const user = userEvent.setup();
	let locationSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
			...window.location,
			href: '',
		} as any);
	});

	afterEach(() => {
		vi.clearAllMocks();
		locationSpy.mockRestore();
	});

	it('renders button with text', () => {
		render(<LoginButton />);
		expect(screen.getByText('Login')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('redirects to OAuth URL on click', async () => {
		render(<LoginButton />);

		await user.click(screen.getByRole('button'));

		expect(fetchOAuthAccessToken).toHaveBeenCalled();
	});
});
