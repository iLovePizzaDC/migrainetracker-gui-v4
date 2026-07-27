import Combobox from '@/shared/components/atoms/Combobox';
import type { DropdownOption } from '@/shared/types/input/input';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

const mockOptions: DropdownOption[] = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
];

describe('<Combobox />', () => {
	const user = userEvent.setup();
	const defaultProps = {
		id: 'test-combobox',
		options: mockOptions,
		selected: [],
		onChange: vi.fn(),
	};

	describe('rendering', () => {
		it('renders input', () => {
			render(<Combobox {...defaultProps} />);

			expect(screen.getByRole('combobox')).toBeInTheDocument();
		});

		it('renders label when provided', () => {
			render(<Combobox {...defaultProps} label='Fruits' />);

			expect(screen.getByText('Fruits')).toBeInTheDocument();
		});

		it('does not render label when not provided', () => {
			render(<Combobox {...defaultProps} />);

			expect(screen.queryByRole('label')).not.toBeInTheDocument();
		});

		it('renders placeholder', () => {
			render(<Combobox {...defaultProps} placeholder='Search...' />);

			expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
		});

		it('renders selected items as badges', () => {
			render(<Combobox {...defaultProps} selected={[mockOptions[0], mockOptions[1]]} />);

			expect(screen.getByText('Apple')).toBeInTheDocument();
			expect(screen.getByText('Banana')).toBeInTheDocument();
		});

		it('renders empty placeholder div when nothing is selected', () => {
			const { container } = render(<Combobox {...defaultProps} selected={[]} />);

			expect(container.querySelector('.h-5')).toBeInTheDocument();
		});
	});

	describe('disabled state', () => {
		it('hides input when disabled', () => {
			render(<Combobox {...defaultProps} disabled />);

			expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
		});

		it('does not show remove button on badges when disabled', () => {
			render(<Combobox {...defaultProps} selected={[mockOptions[0]]} disabled />);

			expect(screen.queryByRole('button')).toBeDisabled();
		});
	});

	describe('options dropdown', () => {
		it('shows options when input is clicked', async () => {
			render(<Combobox {...defaultProps} />);

			await user.click(screen.getByRole('combobox'));
			await user.keyboard('{ArrowDown}');

			expect(await screen.findByText('Apple')).toBeInTheDocument();
			expect(screen.getByText('Banana')).toBeInTheDocument();
		});

		it('filters options based on query', async () => {
			render(<Combobox {...defaultProps} />);

			await user.click(screen.getByRole('combobox'));
			await user.type(screen.getByRole('combobox'), 'app');

			expect(await screen.findByText('Apple')).toBeInTheDocument();
			expect(screen.queryByText('Banana')).not.toBeInTheDocument();
		});

		it('shows "No results" when query matches nothing', async () => {
			render(<Combobox {...defaultProps} />);

			await user.type(screen.getByRole('combobox'), 'xyz');

			expect(await screen.findByText('No results')).toBeInTheDocument();
		});
	});

	describe('selection', () => {
		it('calls onChange when an option is selected', async () => {
			const mockOnChange = vi.fn();

			render(<Combobox {...defaultProps} onChange={mockOnChange} />);

			await user.click(screen.getByRole('combobox'));
			await user.keyboard('{ArrowDown}');
			await user.click(await screen.findByText('Apple'));

			expect(mockOnChange).toHaveBeenCalled();
		});

		it('calls onChange with filtered list when a badge is removed', async () => {
			const mockOnChange = vi.fn();

			render(
				<Combobox
					{...defaultProps}
					selected={[mockOptions[0], mockOptions[1]]}
					onChange={mockOnChange}
				/>,
			);

			await user.click(screen.getAllByRole('button')[0]);

			expect(mockOnChange).toHaveBeenCalledWith([mockOptions[1]]);
		});
	});

	describe('renderOptionActions', () => {
		it('renders custom option actions', async () => {
			const mockRenderOptionActions = () => <button>Action</button>;
			render(<Combobox {...defaultProps} renderOptionActions={mockRenderOptionActions} />);

			await user.click(screen.getByRole('combobox'));
			await user.keyboard('{ArrowDown}');

			expect(await screen.findAllByText('Action')).toHaveLength(mockOptions.length);
		});
	});
});
