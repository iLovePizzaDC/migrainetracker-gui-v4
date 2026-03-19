import LoginButton from '@/features/landing-page/components/atoms/LoginButton';
import { fetchOAuthAccessToken } from '@/shared/api/google.api';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/google.api', () => ({
	fetchOAuthAccessToken: vi.fn(() => 'https://auth.example.com'),
}));

let locationSpy: ReturnType<typeof vi.spyOn>;

describe('<LoginButton />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
			...window.location,
			href: '',
		} as any);
	});

	afterEach(() => {
		locationSpy.mockRestore();
	});

	it('renders button and text', () => {
		render(<LoginButton />);

		expect(screen.getByText('Login')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('redirects to OAuth URL on click', async () => {
		const locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
			...window.location,
			href: '',
		} as any);

		render(<LoginButton />);

		await user.click(screen.getByRole('button'));

		expect(fetchOAuthAccessToken).toHaveBeenCalled();
		locationSpy.mockRestore();
	});

	it('calls fetchOAuthAccessToken with autoLogin=true when session cookie exists', async () => {
		Object.defineProperty(document, 'cookie', {
			value: 'MT_session=abc123',
			writable: true,
		});

		render(<LoginButton />);

		await user.click(screen.getByRole('button'));

		expect(fetchOAuthAccessToken).toHaveBeenCalledWith(true);

		Object.defineProperty(document, 'cookie', { value: '', writable: true });
	});

	it('calls fetchOAuthAccessToken with autoLogin=false when no session cookie', async () => {
		Object.defineProperty(document, 'cookie', { value: '', writable: true });

		render(<LoginButton />);

		await user.click(screen.getByRole('button'));

		expect(fetchOAuthAccessToken).toHaveBeenCalledWith(false);
	});
});
