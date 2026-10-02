import PrivacyPage from '@/pages/legal/PrivacyPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

describe('<PrivacyPage />', () => {
	it('states that this policy is separate from the portfolio and covers Google Limited Use', () => {
		render(
			<MemoryRouter>
				<PrivacyPage lang='en' />
			</MemoryRouter>,
		);

		expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
		expect(screen.getByText(/does not cover the portfolio/)).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'nicobetz.de' })).toHaveAttribute(
			'href',
			'https://nicobetz.de',
		);
		expect(screen.getByText(/including the Limited Use requirements/)).toBeInTheDocument();
		expect(screen.getByText(/n.betz1102@gmail.com/)).toBeInTheDocument();
	});

	it('renders the German notice for the migraine domain', () => {
		render(
			<MemoryRouter>
				<PrivacyPage lang='de' />
			</MemoryRouter>,
		);

		expect(screen.getByRole('heading', { name: 'Datenschutz' })).toBeInTheDocument();
		expect(screen.getByText(/gilt nicht für das Portfolio/)).toBeInTheDocument();
		expect(screen.getByText(/Limited Use Requirements/)).toBeInTheDocument();
	});
});
