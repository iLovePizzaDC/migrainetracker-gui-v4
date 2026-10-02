import LandingPage from '@/pages/LandingPage';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<LandingPage />', () => {
	it('introduces the diary and the sign-in', () => {
		render(<LandingPage />);

		expect(screen.getByRole('heading', { name: 'MigraineTracker' })).toBeInTheDocument();
		expect(screen.getByText(/A quiet diary for episodes/)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument();
		expect(screen.getByText(/Not a diagnosis or a treatment/)).toBeInTheDocument();
	});

	it('explains that sign-in stores health details and links the privacy policy', () => {
		render(<LandingPage />);

		expect(
			screen.getByText(/including health details, in your Google Calendar/),
		).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
			'href',
			'/privacy',
		);
	});

	it('names the calendar, the overview, and where entries are kept', () => {
		render(<LandingPage />);

		expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Your calendar' })).toBeInTheDocument();
		expect(screen.getByText(/Entries stay in your Google Calendar/)).toBeInTheDocument();
	});
});
