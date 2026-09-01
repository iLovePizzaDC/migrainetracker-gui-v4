import SubmitButton from '@/shared/components/atoms/SubmitButton';
import { BUTTON_TYPES } from '@/shared/constants/input/button';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('<SubmitButton />', () => {
	const user = userEvent.setup();

	it('renders button and label', () => {
		render(<SubmitButton type={BUTTON_TYPES.BUTTON} label='Test label' />);

		expect(screen.getByText('Test label')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('calls onClick on button click', async () => {
		const mockOnClick = vi.fn();

		render(<SubmitButton type={BUTTON_TYPES.BUTTON} label='Test label' onClick={mockOnClick} />);

		await user.click(screen.getByText('Test label'));

		expect(mockOnClick).toHaveBeenCalled();
	});

	it('is disabled if prop is true', () => {
		render(<SubmitButton type={BUTTON_TYPES.BUTTON} label='Test label' disabled />);

		expect(screen.getByText('Test label')).toBeDisabled();
	});

	it('passes classNames down correctly', () => {
		render(
			<SubmitButton
				type={BUTTON_TYPES.BUTTON}
				label='Test label'
				className='testclass'
				variant='secondary'
			/>,
		);

		expect(screen.getByText('Test label')).toHaveClass('btn-secondary', 'testclass');
	});

	it('uses primary variant by default', () => {
		render(<SubmitButton type={BUTTON_TYPES.BUTTON} label='Test label' />);

		expect(screen.getByText('Test label')).toHaveClass('btn-primary');
	});

	it('applies success feedback styling', () => {
		render(<SubmitButton type={BUTTON_TYPES.BUTTON} label='Test label' feedback='success' />);

		expect(screen.getByText('Test label')).toHaveClass('btn-feedback-success');
	});

	it('shows loading label when loading', () => {
		render(
			<SubmitButton type={BUTTON_TYPES.BUTTON} label='Save' loadingLabel='Saving...' loading />,
		);

		expect(screen.getByText('Saving...')).toBeDisabled();
	});
});
