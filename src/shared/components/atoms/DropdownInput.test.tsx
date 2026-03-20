import DropdownInput from '@/shared/components/atoms/DropdownInput';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockOptions = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
];

describe('<DropdownInput />', () => {
	const user = userEvent.setup();
	const defaultProps = {
		id: 'test-dropdown',
		label: 'Fruit',
		value: 'apple',
		options: mockOptions,
		onChange: vi.fn(),
	};

	afterEach(() => vi.clearAllMocks());

	describe('rendering', () => {
		it('renders label', () => {
			render(<DropdownInput {...defaultProps} />);

			expect(screen.getByText('Fruit')).toBeInTheDocument();
		});

		it('renders trigger button with current value label', () => {
			render(<DropdownInput {...defaultProps} />);

			expect(screen.getByTestId('dropdown-menu-trigger')).toHaveTextContent('Apple');
		});

		it('renders "Select..." when value matches no option', () => {
			render(<DropdownInput {...defaultProps} value='unknown' />);

			expect(screen.getByTestId('dropdown-menu-trigger')).toHaveTextContent('Select...');
		});

		it('hidden input has correct value', () => {
			render(<DropdownInput {...defaultProps} />);

			expect(screen.getByRole('textbox', { hidden: true })).toHaveValue('apple');
		});

		it('hidden input is required when required prop is set', () => {
			render(<DropdownInput {...defaultProps} required />);

			expect(screen.getByRole('textbox', { hidden: true })).toBeRequired();
		});
	});

	describe('dropdown open/close', () => {
		it('opens dropdown on trigger click', async () => {
			render(<DropdownInput {...defaultProps} />);

			await user.click(screen.getByTestId('dropdown-menu-trigger'));

			expect(screen.getByText('Banana')).toBeInTheDocument();
			expect(screen.getByText('Cherry')).toBeInTheDocument();
		});

		it('closes dropdown on second trigger click', async () => {
			render(<DropdownInput {...defaultProps} />);

			await user.click(screen.getByTestId('dropdown-menu-trigger'));
			await user.click(screen.getByTestId('dropdown-menu-trigger'));

			expect(screen.queryByText('Banana')).not.toBeInTheDocument();
		});

		it('closes dropdown when clicking outside', async () => {
			render(<DropdownInput {...defaultProps} />);

			await user.click(screen.getByTestId('dropdown-menu-trigger'));
			await user.click(document.body);

			expect(screen.queryByText('Banana')).not.toBeInTheDocument();
		});
	});

	describe('selection', () => {
		it('calls onChange with selected value', async () => {
			const mockOnChange = vi.fn();

			render(<DropdownInput {...defaultProps} onChange={mockOnChange} />);

			await user.click(screen.getByTestId('dropdown-menu-trigger'));
			await user.click(screen.getByTestId('banana'));

			expect(mockOnChange).toHaveBeenCalledWith('banana');
		});

		it('closes dropdown after selection', async () => {
			render(<DropdownInput {...defaultProps} />);

			await user.click(screen.getByTestId('dropdown-menu-trigger'));
			await user.click(screen.getByTestId('banana'));

			expect(screen.queryByText('Cherry')).not.toBeInTheDocument();
		});

		it('highlights the currently selected option', async () => {
			render(<DropdownInput {...defaultProps} value='banana' />);

			await user.click(screen.getByTestId('dropdown-menu-trigger'));

			expect(screen.getByTestId('banana')).toHaveClass('bg-white/20');
			expect(screen.getByTestId('apple')).not.toHaveClass('bg-white/20');
		});
	});
});
