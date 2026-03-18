import Button from '@/features/home/components/atoms/card/Button';
import { BUTTON_TYPES } from '@/shared/constants/input/button';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('<Button />', () => {
	it('render button correct title and type', () => {
		render(<Button type={BUTTON_TYPES.BUTTON} title='Test title' />);

		expect(screen.getByText('Test title')).toBeInTheDocument();
		expect(screen.getByText('Test title')).toHaveAttribute('type', 'button');
	});

	it('renders with type submit', () => {
		render(<Button type={BUTTON_TYPES.SUBMIT} title='Test title' />);

		expect(screen.getByText('Test title')).toHaveAttribute('type', 'submit');
	});
});
