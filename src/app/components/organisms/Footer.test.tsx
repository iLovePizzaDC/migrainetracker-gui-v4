import Footer from '@/app/components/organisms/Footer';
import * as userApi from '@/shared/api/user.api';
import * as useUserHook from '@/shared/hooks/user/use-user';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockUser = {
	id: 'user-1',
	email: 'test@example.com',
	name: 'John Doe',
	given_name: 'John',
	family_name: 'Doe',
};
vi.mock('@/shared/hooks/user/use-user');
vi.mock('@/shared/api/user.api');

describe('<Footer />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		vi.mocked(useUserHook.useUser).mockReturnValue({
			user: mockUser,
			medicines: [],
			setUser: vi.fn(),
			addMedicine: vi.fn(),
			removeMedicine: vi.fn(),
		});
	});

	afterEach(() => vi.clearAllMocks());

	it('renders copyright text', () => {
		render(<Footer />);
		expect(screen.getByText(/MigraineTracker – Luna/)).toBeInTheDocument();
	});

	it('renders logout button', () => {
		render(<Footer />);
		expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
	});

	it('does not render logout button when user is null', () => {
		vi.mocked(useUserHook.useUser).mockReturnValue({
			user: null,
			medicines: [],
			setUser: vi.fn(),
			addMedicine: vi.fn(),
			removeMedicine: vi.fn(),
		});

		render(<Footer />);

		expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
	});

	it('calls fetchUserLogout on logout click', async () => {
		vi.mocked(userApi.fetchUserLogout).mockResolvedValue(undefined as any);
		render(<Footer />);

		await user.click(screen.getByRole('button', { name: 'Logout' }));

		expect(userApi.fetchUserLogout).toHaveBeenCalledOnce();
	});
});
