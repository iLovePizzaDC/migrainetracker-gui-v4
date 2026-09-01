import CardShell from '@/features/chart-cards/components/atoms/card/CardShell';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<CardShell />', () => {
	it('renders children', () => {
		render(
			<CardShell>
				<p>Card content</p>
			</CardShell>,
		);

		expect(screen.getByText('Card content')).toBeInTheDocument();
	});

	it('always applies the base shell classes', () => {
		render(
			<CardShell data-testid='card-shell'>
				<p>Card content</p>
			</CardShell>,
		);

		expect(screen.getByTestId('card-shell')).toHaveClass('glass-panel', 'min-w-0', 'w-full', 'self-start');
	});

	it('applies padded classes by default', () => {
		render(
			<CardShell data-testid='card-shell'>
				<p>Card content</p>
			</CardShell>,
		);

		expect(screen.getByTestId('card-shell')).toHaveClass('relative', 'card-padding');
	});

	it('omits padded classes when padded is false', () => {
		render(
			<CardShell padded={false} data-testid='card-shell'>
				<p>Card content</p>
			</CardShell>,
		);

		expect(screen.getByTestId('card-shell')).not.toHaveClass('relative', 'card-padding');
	});

	it('merges a custom className', () => {
		render(
			<CardShell className='custom-class' data-testid='card-shell'>
				<p>Card content</p>
			</CardShell>,
		);

		expect(screen.getByTestId('card-shell')).toHaveClass('custom-class');
	});

	it('forwards additional props to the root element', () => {
		render(
			<CardShell tabIndex={-1} data-testid='card-shell'>
				<p>Card content</p>
			</CardShell>,
		);

		expect(screen.getByTestId('card-shell')).toHaveAttribute('tabindex', '-1');
	});
});
