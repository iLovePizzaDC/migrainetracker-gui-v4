import Durations from '@/features/calendar/components/molecules/forms/Durations';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockOnChange = vi.fn();
const mockDurations = [
	{
		id: 0,
		startTime: '10:00',
		endTime: '15:00',
	},
];

describe('<Durations />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnChange.mockClear();
	});

	it('renders the header, add button and time pickers', () => {
		render(<Durations durations={mockDurations} onChange={mockOnChange} />);

		expect(screen.getByText('Duration')).toBeInTheDocument();
		expect(screen.getByTestId('add-button')).toBeInTheDocument();
		expect(screen.getByLabelText('Start')).toBeInTheDocument();
		expect(screen.getByLabelText('End')).toBeInTheDocument();
	});

	it('shows remove button for min 2 duration pairs', () => {
		const twoDurations = [
			...mockDurations,
			{
				id: 1,
				startTime: '15:00',
				endTime: '18:00',
			},
		];
		render(<Durations durations={twoDurations} onChange={mockOnChange} />);

		expect(screen.getAllByText('Remove')).toHaveLength(2);
	});

	it('does not show remove button with min 2 duration pairs and disabled', () => {
		const twoDurations = [
			...mockDurations,
			{
				id: 1,
				startTime: '15:00',
				endTime: '18:00',
			},
		];
		render(<Durations durations={twoDurations} onChange={mockOnChange} disabled />);

		expect(screen.queryByText('Remove')).not.toBeInTheDocument();
	});

	it('calls onChange on button click', async () => {
		render(<Durations durations={mockDurations} onChange={mockOnChange} />);

		await user.click(screen.getByTestId('add-button'));

		expect(mockOnChange).toHaveBeenCalled();
	});

	it('is disabled if prop is true', () => {
		render(<Durations durations={mockDurations} onChange={mockOnChange} disabled />);

		expect(screen.queryByTestId('add-button')).not.toBeInTheDocument();
		expect(screen.getByLabelText('Start')).toBeDisabled();
		expect(screen.getByLabelText('End')).toBeDisabled();
	});
});
