import Intensity from '@/features/calendar/components/molecules/Intensity';
import { INTENSITY_TYPES } from '@/shared/constants/event/event-details';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';

const setIntensity = vi.fn();

describe('<Intensity />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		setIntensity.mockClear();
	});

	it('renders the heading and the select input', async () => {
		render(<Intensity intensity={INTENSITY_TYPES.MEDIUM} setIntensity={setIntensity} />);

		expect(screen.getByText('Intensity')).toBeInTheDocument();
		expect(screen.getByTestId('select-input')).toBeInTheDocument();
	});

	it('calls setIntensity when selection changes', async () => {
		render(<Intensity intensity={INTENSITY_TYPES.MEDIUM} setIntensity={setIntensity} />);

		await user.click(screen.getByText('High'));

		expect(setIntensity).toHaveBeenCalledWith(INTENSITY_TYPES.HIGH);
	});

	it('is disabled if prop is true', async () => {
		render(<Intensity intensity={INTENSITY_TYPES.MEDIUM} setIntensity={setIntensity} disabled />);

		expect(screen.getByRole('radio', { name: 'Very High' })).toBeDisabled();
		expect(screen.getByRole('radio', { name: 'High' })).toBeDisabled();
		expect(screen.getByRole('radio', { name: 'Medium' })).toBeDisabled();
		expect(screen.getByRole('radio', { name: 'Low' })).toBeDisabled();
	});
});
