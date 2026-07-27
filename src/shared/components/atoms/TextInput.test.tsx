import TextInput from '@/shared/components/atoms/TextInput';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('<TextInput />', () => {
	const user = userEvent.setup();
	const defaultProps = {
		id: 'test-id',
		label: 'Test label',
		value: 'Test value',
		onChange: vi.fn(),
	};

	it('renders label and input field correctly', () => {
		render(<TextInput {...defaultProps} />);

		expect(screen.getByText('Test label')).toBeInTheDocument();
		expect(screen.getByRole('textbox')).toBeInTheDocument();
	});

	it('renders correct value', () => {
		render(<TextInput {...defaultProps} />);

		expect(screen.getByRole('textbox')).toHaveAttribute('value', 'Test value');
	});

	it('renders correct placeholder', () => {
		render(<TextInput {...defaultProps} placeholder='Test placeholder' />);

		expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Test placeholder');
	});

	it('calls onChange when value of input changes', async () => {
		const mockOnChange = vi.fn();

		render(<TextInput {...defaultProps} onChange={mockOnChange} />);

		await user.type(screen.getByLabelText('Test label'), 'asdf');

		expect(mockOnChange).toHaveBeenCalled();
	});

	it('is disabled if prop is true', () => {
		render(<TextInput {...defaultProps} disabled />);

		expect(screen.getByRole('textbox')).toBeDisabled();
	});

	it('is required if prop is true', () => {
		render(<TextInput {...defaultProps} required />);

		expect(screen.getByRole('textbox')).toBeRequired();
	});
});
