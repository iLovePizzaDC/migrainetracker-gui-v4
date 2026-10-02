import App from '@/app/App';
import { useAuthCheck } from '@/app/hooks/use-auth-check';
import { useUser } from '@/shared/hooks/use-user';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/use-user');
vi.mock('@/app/hooks/use-auth-check');

const loggedOutUserState = {
	user: null,
	medicines: [],
	setUser: vi.fn(),
	addMedicine: vi.fn(),
	removeMedicine: vi.fn(),
};

const legalRoutes = [
	{ routePath: '/privacy', pageHeading: 'Privacy Policy' },
	{ routePath: '/datenschutz', pageHeading: 'Datenschutz' },
	{ routePath: '/impressum', pageHeading: 'Impressum' },
	{ routePath: '/imprint', pageHeading: 'Imprint' },
];

function renderApp(routePath: string) {
	return render(
		<MemoryRouter initialEntries={[routePath]}>
			<App />
		</MemoryRouter>,
	);
}

describe('<App />', () => {
	beforeEach(() => {
		vi.mocked(useUser).mockReturnValue(loggedOutUserState);
		vi.mocked(useAuthCheck).mockReturnValue({ authChecked: true });
	});

	it.each(legalRoutes)(
		'renders $pageHeading at $routePath before auth finishes',
		({ routePath, pageHeading }) => {
			vi.mocked(useAuthCheck).mockReturnValue({ authChecked: false });

			renderApp(routePath);

			expect(screen.getByRole('heading', { name: pageHeading })).toBeInTheDocument();
			expect(screen.queryByText('Signing in')).not.toBeInTheDocument();
		},
	);

	it('shows the landing page once auth is checked and nobody is signed in', () => {
		renderApp('/');

		expect(screen.getByRole('heading', { name: 'MigraineTracker' })).toBeInTheDocument();

		const privacyPolicyLinks = screen.getAllByRole('link', { name: 'Privacy Policy' });

		expect(privacyPolicyLinks.length).toBeGreaterThan(0);

		for (const privacyPolicyLink of privacyPolicyLinks) {
			expect(privacyPolicyLink).toHaveAttribute('href', '/privacy');
		}
	});

	it('shows the signing-in state on the home route until auth is checked', () => {
		vi.mocked(useAuthCheck).mockReturnValue({ authChecked: false });

		renderApp('/');

		expect(screen.getByText('Signing in')).toBeInTheDocument();
		expect(screen.queryByRole('button', { name: 'Sign in with Google' })).not.toBeInTheDocument();
	});
});
