import PrivacyPage from '@/pages/legal/PrivacyPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

const contactEmailAddress = 'n.betz1102@gmail.com';

function renderPrivacyPage(language: 'de' | 'en' = 'en') {
	return render(
		<MemoryRouter>
			<PrivacyPage lang={language} />
		</MemoryRouter>,
	);
}

function expectContactEmailLinks() {
	const contactEmailLinks = screen.getAllByRole('link', { name: contactEmailAddress });

	expect(contactEmailLinks.length).toBeGreaterThan(0);

	for (const contactEmailLink of contactEmailLinks) {
		expect(contactEmailLink).toHaveAttribute('href', `mailto:${contactEmailAddress}`);
	}
}

describe('<PrivacyPage />', () => {
	describe('english notice', () => {
		it('states that this policy is separate from the portfolio', () => {
			renderPrivacyPage('en');

			expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
			expect(screen.getByText(/does not cover the portfolio/)).toBeInTheDocument();
			expect(screen.getByRole('link', { name: 'nicobetz.de' })).toHaveAttribute(
				'href',
				'https://nicobetz.de',
			);
			expect(screen.getByRole('link', { name: 'migraine.nicobetz.de' })).toHaveAttribute(
				'href',
				'https://migraine.nicobetz.de',
			);
		});

		it('covers Google Limited Use and the calendar scope', () => {
			renderPrivacyPage('en');

			expect(screen.getByText(/including the Limited Use requirements/)).toBeInTheDocument();
			expect(
				screen.getByRole('link', { name: 'Google API Services User Data Policy' }),
			).toHaveAttribute(
				'href',
				'https://developers.google.com/terms/api-services-user-data-policy',
			);
			expect(
				screen.getByText(/https:\/\/www\.googleapis\.com\/auth\/calendar/),
			).toBeInTheDocument();
			expect(screen.getByText(/That is health data/)).toBeInTheDocument();
		});

		it('links the controller email and the German version', () => {
			renderPrivacyPage('en');

			expectContactEmailLinks();
			expect(screen.getByRole('link', { name: 'Deutsche Fassung' })).toHaveAttribute(
				'href',
				'/datenschutz',
			);
			expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/');
		});

		it('sets the english document title', () => {
			renderPrivacyPage('en');

			expect(document.title).toBe('Privacy Policy · MigraineTracker');
		});

		it('uses english when no language is passed', () => {
			render(
				<MemoryRouter>
					<PrivacyPage />
				</MemoryRouter>,
			);

			expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
		});
	});

	describe('german notice', () => {
		it('states that this notice does not cover the portfolio', () => {
			renderPrivacyPage('de');

			expect(screen.getByRole('heading', { name: 'Datenschutz' })).toBeInTheDocument();
			expect(screen.getByText(/gilt nicht für das Portfolio/)).toBeInTheDocument();
			expect(screen.getByRole('link', { name: 'nicobetz.de' })).toHaveAttribute(
				'href',
				'https://nicobetz.de',
			);
		});

		it('includes the Limited Use wording and the calendar permission', () => {
			renderPrivacyPage('de');

			expect(screen.getByText(/Limited Use Requirements/)).toBeInTheDocument();
			expect(
				screen.getByText(/https:\/\/www\.googleapis\.com\/auth\/calendar/),
			).toBeInTheDocument();
			expect(screen.getByText(/Das sind Gesundheitsdaten/)).toBeInTheDocument();
		});

		it('links the controller email and the english version', () => {
			renderPrivacyPage('de');

			expectContactEmailLinks();
			expect(screen.getByText(/Ofengasse 2/)).toBeInTheDocument();
			expect(screen.getByRole('link', { name: 'English version' })).toHaveAttribute(
				'href',
				'/privacy',
			);
		});

		it('sets the german document title', () => {
			renderPrivacyPage('de');

			expect(document.title).toBe('Datenschutz · MigraineTracker');
		});
	});
});
