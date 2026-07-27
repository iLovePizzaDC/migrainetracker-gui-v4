import Midas from '@/features/calendar/components/molecules/Midas';
import { MIDAS_TYPES } from '@/shared/constants/event/event-details';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockMidasFalse = {
	workMissed: false,
	workImpaired: false,
	choresMissed: false,
	choresImpaired: false,
	socialMissed: false,
};

const mockOnChange = vi.fn();

describe('<Midas />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		mockOnChange.mockClear();
	});

	it('renders the heading', () => {
		render(<Midas midas={mockMidasFalse} onChange={mockOnChange} />);

		expect(screen.getByText('MIDAS')).toBeInTheDocument();
	});

	it('renders pre checked midas', () => {
		const midasWithWork = {
			...mockMidasFalse,
			[MIDAS_TYPES.WORK_MISSED]: true,
			[MIDAS_TYPES.WORK_IMPAIRED]: true,
		};

		render(<Midas midas={midasWithWork} onChange={mockOnChange} />);

		expect(screen.getByLabelText('I missed work')).toBeChecked();
		expect(screen.getByLabelText('my work performance was reduced')).toBeChecked();
		expect(screen.getByLabelText('I missed household chores')).not.toBeChecked();
		expect(
			screen.getByLabelText('my ability to do household chores was reduced'),
		).not.toBeChecked();
		expect(screen.getByLabelText('I missed social activities')).not.toBeChecked();
	});

	it('calls onChange with true when clicking an unchecked option', async () => {
		render(<Midas midas={mockMidasFalse} onChange={mockOnChange} />);

		await user.click(screen.getByLabelText('I missed work'));

		expect(mockOnChange).toHaveBeenCalledWith({ ...mockMidasFalse, [MIDAS_TYPES.WORK_MISSED]: true });
	});

	it('calls onChange with false when clicking a checked option', async () => {
		const midasWithWork = { ...mockMidasFalse, [MIDAS_TYPES.WORK_MISSED]: true };

		render(<Midas midas={midasWithWork} onChange={mockOnChange} />);

		await user.click(screen.getByLabelText('I missed work'));

		expect(mockOnChange).toHaveBeenLastCalledWith({
			...midasWithWork,
			[MIDAS_TYPES.WORK_MISSED]: false,
		});
	});

	it('is disabled if prop is true', () => {
		render(<Midas midas={mockMidasFalse} onChange={mockOnChange} disabled />);

		expect(screen.getByLabelText('I missed work')).toBeDisabled();
		expect(screen.getByLabelText('my work performance was reduced')).toBeDisabled();
		expect(screen.getByLabelText('I missed household chores')).toBeDisabled();
		expect(screen.getByLabelText('my ability to do household chores was reduced')).toBeDisabled();
		expect(screen.getByLabelText('I missed social activities')).toBeDisabled();
	});
});
