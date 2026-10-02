import ImpressumPage from '@/pages/legal/ImpressumPage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

const contactEmailAddress = 'n.betz1102@gmail.com';
const previousDocumentTitle = 'MigraineTracker';

function renderImpressumPage(language: 'de' | 'en' = 'de') {
	return render(
		<MemoryRouter>
			<ImpressumPage lang={language} />
		</MemoryRouter>,
	);
}

describe('<ImpressumPage />', () => {
	describe('german imprint', () => {
		it('shows the provider address and that this site is separate from the portfolio', () => {
			renderImpressumPage('de');

			expect(screen.getByRole('heading', { name: 'Impressum' })).toBeInTheDocument();
			expect(screen.getByText(/Angaben gemäß § 5 DDG/)).toBeInTheDocument();
			expect(screen.getByText(/Ofengasse 2/)).toBeInTheDocument();
			expect(screen.getByText(/71336 Waiblingen/)).toBeInTheDocument();
			expect(screen.getByText(/Deutschland/)).toBeInTheDocument();
			expect(screen.getByRole('link', { name: contactEmailAddress })).toHaveAttribute(
				'href',
				`mailto:${contactEmailAddress}`,
			);
			expect(screen.getByRole('link', { name: 'nicobetz.de' })).toHaveAttribute(
				'href',
				'https://nicobetz.de',
			);
		});

		it('states that the diary is not medical advice and declines consumer arbitration', () => {
			renderImpressumPage('de');

			expect(screen.getByText(/kein Medizinprodukt/)).toBeInTheDocument();
			expect(screen.getByText(/nicht bereit, an Streitbeilegungsverfahren/)).toBeInTheDocument();
		});

		it('links the privacy notices and the english imprint', () => {
			renderImpressumPage('de');

			expect(screen.getByRole('link', { name: 'Datenschutz' })).toHaveAttribute(
				'href',
				'/datenschutz',
			);
			expect(screen.getByRole('link', { name: 'Privacy Policy (English)' })).toHaveAttribute(
				'href',
				'/privacy',
			);
			expect(screen.getByRole('link', { name: 'Imprint' })).toHaveAttribute('href', '/imprint');
			expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/');
		});

		it('uses german when no language is passed', () => {
			render(
				<MemoryRouter>
					<ImpressumPage />
				</MemoryRouter>,
			);

			expect(screen.getByRole('heading', { name: 'Impressum' })).toBeInTheDocument();
		});

		it('sets the document title and restores the previous one', () => {
			document.title = previousDocumentTitle;

			const { unmount } = renderImpressumPage('de');

			expect(document.title).toBe('Impressum · MigraineTracker');

			unmount();

			expect(document.title).toBe(previousDocumentTitle);
		});
	});

	describe('english imprint', () => {
		it('shows the provider address for this domain only', () => {
			renderImpressumPage('en');

			expect(screen.getByRole('heading', { name: 'Imprint' })).toBeInTheDocument();
			expect(screen.getByText(/§ 5 DDG/)).toBeInTheDocument();
			expect(screen.getByText(/Germany/)).toBeInTheDocument();
			expect(screen.getByText(/migraine\.nicobetz\.de only/)).toBeInTheDocument();
			expect(screen.getByRole('link', { name: contactEmailAddress })).toHaveAttribute(
				'href',
				`mailto:${contactEmailAddress}`,
			);
		});

		it('states that the diary is not a medical device', () => {
			renderImpressumPage('en');

			expect(screen.getByText(/not a medical device/)).toBeInTheDocument();
			expect(
				screen.getByText(/not willing to take part in dispute resolution/),
			).toBeInTheDocument();
		});

		it('links the german imprint and both privacy notices', () => {
			renderImpressumPage('en');

			expect(screen.getByRole('link', { name: 'Datenschutz (Deutsch)' })).toHaveAttribute(
				'href',
				'/datenschutz',
			);
			expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
				'href',
				'/privacy',
			);
			expect(screen.getByRole('link', { name: 'Impressum' })).toHaveAttribute('href', '/impressum');
		});

		it('sets the english document title', () => {
			renderImpressumPage('en');

			expect(document.title).toBe('Imprint · MigraineTracker');
		});
	});
});
