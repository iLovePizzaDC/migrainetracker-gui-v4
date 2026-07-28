import CardShell from '@/features/home/components/atoms/card/CardShell';
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

		expect(screen.getByTestId('card-shell')).toHaveClass(
			'w-full',
			'self-start',
			'rounded-2xl',
			'bg-transparent',
			'backdrop-blur-md',
			'border',
			'border-white/20',
			'shadow-lg',
			'shadow-black/20',
			'transition',
			'hover:shadow-xl',
		);
	});

	it('applies padded classes by default', () => {
		render(
			<CardShell data-testid='card-shell'>
				<p>Card content</p>
			</CardShell>,
		);

		expect(screen.getByTestId('card-shell')).toHaveClass('p-3', 'relative');
	});

	it('omits padded classes when padded is false', () => {
		render(
			<CardShell padded={false} data-testid='card-shell'>
				<p>Card content</p>
			</CardShell>,
		);

		expect(screen.getByTestId('card-shell')).not.toHaveClass('p-3', 'relative');
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
