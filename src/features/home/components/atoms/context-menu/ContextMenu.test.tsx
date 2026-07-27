import ContextMenu from '@/features/home/components/atoms/context-menu/ContextMenu';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('<ContextMenu />', () => {
	const user = userEvent.setup();
	const defaultProps = {
		contextButtonRef: {
			current: document.createElement('button'),
		},
		open: true,
		setOpen: vi.fn(),
		isEditing: false,
		setIsEditing: vi.fn(),
		onRemoveClick: vi.fn(),
	};

	it('renders menu items', () => {
		render(<ContextMenu {...defaultProps} />);

		expect(screen.getByText('Edit')).toBeInTheDocument();
		expect(screen.getByText('Remove')).toBeInTheDocument();
	});

	it('does not render menu items when open is false', () => {
		render(<ContextMenu {...defaultProps} open={false} />);

		expect(screen.queryByText('Edit')).not.toBeInTheDocument();
		expect(screen.queryByText('Remove')).not.toBeInTheDocument();
	});

	it('shows "Cancel" when isEditing is true', () => {
		render(<ContextMenu {...defaultProps} isEditing={true} />);

		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	it('shows "Are you sure?" when clicking on "Remove"', async () => {
		render(<ContextMenu {...defaultProps} isEditing={true} />);

		await user.click(screen.getByText('Remove'));

		expect(screen.getByText('Are you sure?')).toBeInTheDocument();
	});

	it('calls setIsEditing on click on edit button', async () => {
		const mockSetIsEditing = vi.fn();
		render(<ContextMenu {...defaultProps} setIsEditing={mockSetIsEditing} />);

		await user.click(screen.getByText('Edit'));

		expect(mockSetIsEditing).toHaveBeenCalledOnce();
	});

	it('has white remove text by default on remove button', async () => {
		const mockOnRemoveClick = vi.fn();
		render(<ContextMenu {...defaultProps} onRemoveClick={mockOnRemoveClick} />);

		expect(screen.getByText('Remove')).not.toHaveClass('text-red-500');
		expect(screen.getByText('Remove')).toHaveClass('text-white');
	});

	it('has red remove text on first click on remove button', async () => {
		const mockOnRemoveClick = vi.fn();
		render(<ContextMenu {...defaultProps} onRemoveClick={mockOnRemoveClick} />);

		await user.click(screen.getByText('Remove'));

		expect(screen.getByText('Are you sure?')).toHaveClass('text-red-500');
		expect(screen.getByText('Are you sure?')).not.toHaveClass('text-white');
	});

	it('does not call onRemoveClick on first click on remove button', async () => {
		const mockOnRemoveClick = vi.fn();
		render(<ContextMenu {...defaultProps} onRemoveClick={mockOnRemoveClick} />);

		await user.click(screen.getByText('Remove'));

		expect(mockOnRemoveClick).not.toHaveBeenCalled();
	});

	it('calls onRemoveClick on second click on remove button', async () => {
		const mockOnRemoveClick = vi.fn();
		render(<ContextMenu {...defaultProps} onRemoveClick={mockOnRemoveClick} />);

		await user.click(screen.getByText('Remove'));
		await user.click(screen.getByText('Are you sure?'));

		expect(mockOnRemoveClick).toHaveBeenCalledOnce();
	});

	it('calls setOpen with false when edit button is clicked', async () => {
		const mockSetOpen = vi.fn();
		render(<ContextMenu {...defaultProps} setOpen={mockSetOpen} />);

		await user.click(screen.getByText('Edit'));

		expect(mockSetOpen).toHaveBeenCalledWith(false);
	});
});
