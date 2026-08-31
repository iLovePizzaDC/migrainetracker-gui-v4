import LoadingBox from '@/app/components/molecules/LoadingBox';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<LoadingBox />', () => {
	it('renders the loading text', () => {
		render(<LoadingBox />);

		expect(screen.getByText('Signing in')).toBeInTheDocument();
	});

	it('renders the user circle icon', () => {
		render(<LoadingBox />);

		expect(document.querySelector('svg')).toBeInTheDocument();
	});

	it('renders a single spinning ring', () => {
		render(<LoadingBox />);

		expect(document.querySelectorAll('.animate-spin')).toHaveLength(1);
	});

	it('spinner has a smooth animation duration', () => {
		render(<LoadingBox />);

		const [spinner] = document.querySelectorAll('.animate-spin');
		expect((spinner as HTMLElement).style.animationDuration).toBe('1.4s');
	});
});
