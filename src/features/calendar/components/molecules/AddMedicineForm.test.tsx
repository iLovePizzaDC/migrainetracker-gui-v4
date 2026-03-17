import AddMedicineForm from '@/features/calendar/components/molecules/AddMedicineForm';
import { fetchUserMedicinesPost } from '@/shared/api/medicine.api';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';

const mockLoadUserMedicines = vi.fn();

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: () => ({
		loadUserMedicines: mockLoadUserMedicines,
	}),
}));

vi.mock('@/shared/api/medicine.api', () => ({
	fetchUserMedicinesPost: vi.fn(),
}));

describe('<AddMedicineForm />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		mockLoadUserMedicines.mockClear();
	});

	it('renders form elements and is visible', () => {
		render(<AddMedicineForm show />);

		expect(screen.getByText('Type')).toBeInTheDocument();
		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Abbreviation')).toBeInTheDocument();
		expect(screen.getByText('Save')).toBeInTheDocument();
	});

	it('set height to 0 if show is false', () => {
		render(<AddMedicineForm show={false} />);

		expect(screen.getByTestId('add-medicine-form')).toHaveStyle('height: 0');
	});

	it('enables submit button if form is valid', async () => {
		render(<AddMedicineForm show />);

		const nameInput = screen.getByLabelText('Name');
		const abbrInput = screen.getByLabelText('Abbreviation');
		const submitButton = screen.getByRole('button', { name: 'Save' });

		expect(submitButton).toBeDisabled();

		await user.type(nameInput, 'Test medicine');
		expect(submitButton).toBeDisabled();

		await user.type(abbrInput, 'tst_med');
		expect(submitButton).not.toBeDisabled();
	});

	it('does not submit if form is invalid', async () => {
		render(<AddMedicineForm show />);
		const user = userEvent.setup();

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(fetchUserMedicinesPost).not.toHaveBeenCalled();
	});

	it('submits form correctly when valid', async () => {
		render(<AddMedicineForm show />);
		const user = userEvent.setup();

		await user.type(screen.getByLabelText('Name'), 'Test medicine');
		await user.type(screen.getByLabelText('Abbreviation'), 'tst_med');

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(fetchUserMedicinesPost).toHaveBeenCalledWith(
			'Test medicine',
			'tst_med',
			MEDICINE_TYPES.MIGRAINE_PAINKILLER,
		);
		expect(mockLoadUserMedicines).toHaveBeenCalled();

		expect(screen.getByLabelText('Name')).toHaveValue('');
		expect(screen.getByLabelText('Abbreviation')).toHaveValue('');
	});

	it('changes type via dropdown', async () => {
		render(<AddMedicineForm show />);
		const user = userEvent.setup();

		await user.click(screen.getByTestId('dropdown-menu-trigger'));
		await user.click(screen.getByText('Painkiller'));

		expect(screen.getByLabelText('Type')).toHaveValue(MEDICINE_TYPES.PAINKILLER);
	});
});
