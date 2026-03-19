import Midas from '@/features/calendar/components/molecules/Midas';
import { MIDAS_TYPES } from '@/shared/constants/event/event-details';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockMidasFalse = {
	workMissed: false,
	workImpaired: false,
	choresMissed: false,
	choresImpaired: false,
	socialMissed: false,
};

const setMidas = vi.fn();

// TODO missing tests adds midas when clicking unchecked option and removes midas when clicking checked option
describe('<Midas />', () => {
	beforeEach(() => {
		setMidas.mockClear();
	});

	it('renders the heading', () => {
		render(<Midas midas={mockMidasFalse} setMidas={setMidas} />);

		expect(screen.getByText('MIDAS')).toBeInTheDocument();
	});

	it('renders pre checked midas', () => {
		const midasWithWork = {
			...mockMidasFalse,
			[MIDAS_TYPES.WORK_MISSED]: true,
			[MIDAS_TYPES.WORK_IMPAIRED]: true,
		};

		render(<Midas midas={midasWithWork} setMidas={setMidas} />);

		expect(screen.getByLabelText('I missed work')).toBeChecked();
		expect(screen.getByLabelText('my work performance was reduced')).toBeChecked();
		expect(screen.getByLabelText('I missed household chores')).not.toBeChecked();
		expect(
			screen.getByLabelText('my ability to do household chores was reduced'),
		).not.toBeChecked();
		expect(screen.getByLabelText('I missed social activities')).not.toBeChecked();
	});

	it('is disabled if prop is true', () => {
		render(<Midas midas={mockMidasFalse} setMidas={setMidas} disabled />);

		expect(screen.getByLabelText('I missed work')).toBeDisabled();
		expect(screen.getByLabelText('my work performance was reduced')).toBeDisabled();
		expect(screen.getByLabelText('I missed household chores')).toBeDisabled();
		expect(screen.getByLabelText('my ability to do household chores was reduced')).toBeDisabled();
		expect(screen.getByLabelText('I missed social activities')).toBeDisabled();
	});
});
