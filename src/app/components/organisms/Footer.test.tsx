import Footer from '@/app/components/organisms/Footer';
import * as userApi from '@/shared/api/user.api';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/api/user.api');

describe('<Footer />', () => {
	const user = userEvent.setup();

	afterEach(() => vi.clearAllMocks());

	it('renders copyright text', () => {
		render(<Footer />);
		expect(screen.getByText(/2025 MigraineTracker/)).toBeInTheDocument();
	});

	it('renders logout button', () => {
		render(<Footer />);
		expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
	});

	it('calls fetchUserLogout on logout click', async () => {
		vi.mocked(userApi.fetchUserLogout).mockResolvedValue(undefined as any);
		render(<Footer />);

		await user.click(screen.getByRole('button', { name: 'Logout' }));

		expect(userApi.fetchUserLogout).toHaveBeenCalledOnce();
	});
});
