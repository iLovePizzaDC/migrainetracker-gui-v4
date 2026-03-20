import MenuItem from '@/features/home/components/atoms/context-menu/MenuItem';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('<MenuItem />', () => {
	const user = userEvent.setup();
	const defaultProps = {
		label: 'Test label',
		onClick: vi.fn(),
	};

	it('renders button with text', () => {
		render(<MenuItem {...defaultProps} />);

		expect(screen.getByRole('button')).toBeInTheDocument();
		expect(screen.getByText('Test label')).toBeInTheDocument();
	});

	it('calls onClick on button click', async () => {
		const mockOnClick = vi.fn();
		render(<MenuItem {...defaultProps} onClick={mockOnClick} />);

		await user.click(screen.getByText('Test label'));

		expect(mockOnClick).toHaveBeenCalled();
	});
});
