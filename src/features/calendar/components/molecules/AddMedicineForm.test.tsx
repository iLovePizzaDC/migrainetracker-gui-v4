import AddMedicineForm from '@/features/calendar/components/molecules/AddMedicineForm';
import { fetchUserMedicinesPost } from '@/shared/api/medicine.api';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockMedLabel = 'test medicine';
const mockMedValue = 'tst_med';
const mockUserMedicines = [
	{
		name: `${mockMedLabel} 1`,
		abbreviation: `${mockMedValue}_1`,
		type: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
	},
	{
		name: `${mockMedLabel} 2`,
		abbreviation: `${mockMedValue}_2`,
		type: MEDICINE_TYPES.PAINKILLER,
	},
];

const mockAddMedicine = vi.fn();

vi.mock('@/shared/hooks/user/use-user', () => ({
	useUser: () => ({
		medicines: mockUserMedicines,
		addMedicine: mockAddMedicine,
	}),
}));

vi.mock('@/shared/api/medicine.api', () => ({
	fetchUserMedicinesPost: vi.fn(),
}));

describe('<AddMedicineForm />', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const user = userEvent.setup();

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

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(mockAddMedicine).not.toHaveBeenCalled();
		expect(fetchUserMedicinesPost).not.toHaveBeenCalled();
	});

	it('submits form correctly when valid', async () => {
		render(<AddMedicineForm show />);

		await user.type(screen.getByLabelText('Name'), 'Test medicine');
		await user.type(screen.getByLabelText('Abbreviation'), 'tst_med');

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(mockAddMedicine).toHaveBeenCalledWith({
			name: 'Test medicine',
			abbreviation: 'tst_med',
			type: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
		});

		expect(fetchUserMedicinesPost).toHaveBeenCalledWith(
			'Test medicine',
			'tst_med',
			MEDICINE_TYPES.MIGRAINE_PAINKILLER,
		);

		expect(screen.getByLabelText('Name')).toHaveValue('');
		expect(screen.getByLabelText('Abbreviation')).toHaveValue('');
	});

	it('shows error message if API call fails', async () => {
		vi.mocked(fetchUserMedicinesPost).mockRejectedValueOnce(new Error('API Error'));

		render(<AddMedicineForm show />);

		await user.type(screen.getByLabelText('Name'), 'Test medicine');
		await user.type(screen.getByLabelText('Abbreviation'), 'tst_med');

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(screen.getByLabelText('Name')).toHaveValue('Test medicine');
		expect(screen.getByLabelText('Abbreviation')).toHaveValue('tst_med');
	});

	it('changes type via dropdown', async () => {
		render(<AddMedicineForm show />);

		await user.click(screen.getByTestId('dropdown-menu-trigger'));
		await user.click(screen.getByText('Painkiller'));

		expect(screen.getByLabelText('Type')).toHaveValue(MEDICINE_TYPES.PAINKILLER);
	});

	it('disables button while submitting', async () => {
		vi.mocked(fetchUserMedicinesPost).mockImplementation(
			() => new Promise((resolve) => setTimeout(resolve, 100)),
		);

		render(<AddMedicineForm show />);

		await user.type(screen.getByLabelText('Name'), 'Test medicine');
		await user.type(screen.getByLabelText('Abbreviation'), 'tst_med');

		const submitButton = screen.getByRole('button', { name: 'Save' });

		await user.click(submitButton);

		expect(submitButton).toHaveTextContent('Saving...');
		expect(submitButton).toBeDisabled();
	});
});
