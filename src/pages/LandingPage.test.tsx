import LandingPage from '@/pages/LandingPage';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<LandingPage />', () => {
	it('explains that sign-in stores health details and links the privacy policy', () => {
		render(<LandingPage />);

		expect(screen.getByRole('heading', { name: 'MigraineTracker' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeInTheDocument();
		expect(
			screen.getByText(/including health details, in your Google Calendar/),
		).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
			'href',
			'/privacy',
		);
	});
});
