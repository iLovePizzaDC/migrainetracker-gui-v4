import MedicineCombobox from '@/features/calendar/components/molecules/MedicineCombobox';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const medLabel = 'test medicine';
const medValue = 'tst-med';

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: () => ({
		userMedicineOptions: [{ label: `${medLabel} 1`, value: `${medValue}-1` }],
		loadUserMedicines: vi.fn(),
	}),
}));

vi.mock('@/shared/hooks/use-click-outside', () => ({
	useClickOutside: vi.fn(),
}));

vi.mock('@/shared/api/medicine.api', () => ({
	fetchUserMedicinesDelete: vi.fn(),
}));

vi.mock('@/shared/components/atoms/Combobox', () => ({
	default: ({ selected, onChange, renderOptionActions, disabled }: any) => (
		<div>
			{selected.map((option: any) => (
				<span key={option.value}>{option.label}</span>
			))}
			{renderOptionActions?.({ label: `${medLabel} 1`, value: `${medValue}-1` })}
			<button onClick={() => onChange([{ label: `${medLabel} 1`, value: `${medValue}-1` }])}>
				select
			</button>
			{disabled && <span data-testid='disabled' />}
		</div>
	),
}));

const medicines = [
	{
		medicine: {
			abbreviation: `${medValue}-1`,
			label: `${medLabel} 1`,
		},
		taken: 1,
		effectiveness: 0,
	},
	{
		medicine: {
			abbreviation: `${medValue}-2`,
			label: `${medLabel} 2`,
		},
		taken: 2,
		effectiveness: 2,
	},
];

const setMedicines = vi.fn();

describe('<MedicineCombobox />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		setMedicines.mockClear();
	});

	it('renders pre-selected medicines', () => {
		render(<MedicineCombobox medicines={medicines} setMedicines={setMedicines} />);

		expect(screen.getByText('test medicine 1')).toBeInTheDocument();
		expect(screen.getByText('test medicine 2')).toBeInTheDocument();
	});

	it('calls setMedicines with correct structure when selecting', async () => {
		render(<MedicineCombobox medicines={[]} setMedicines={setMedicines} />);

		await user.click(screen.getByText('select'));

		expect(setMedicines).toHaveBeenCalledWith([
			{
				medicine: { label: 'test medicine 1', abbreviation: 'tst-med-1' },
				taken: 1,
				effectiveness: 0,
			},
		]);
	});

	it('shows trash icon by default', () => {
		render(<MedicineCombobox medicines={medicines} setMedicines={setMedicines} />);

		expect(screen.queryByTestId('trash-icon')).toBeInTheDocument();
	});

	it('shows confirm icon after clicking trash', async () => {
		render(<MedicineCombobox medicines={medicines} setMedicines={setMedicines} />);

		await user.click(screen.getByRole('button', { name: 'Delete test medicine 1' }));

		expect(screen.queryByTestId('confirm-icon')).toBeInTheDocument();
	});

	it('calls deleteMedicine after confirming', async () => {
		const { fetchUserMedicinesDelete } = await import('@/shared/api/medicine.api');

		render(<MedicineCombobox medicines={medicines} setMedicines={setMedicines} />);

		const deleteBtn = screen.getByRole('button', { name: 'Delete test medicine 1' });
		await user.click(deleteBtn);
		await user.click(deleteBtn);

		expect(fetchUserMedicinesDelete).toHaveBeenCalledWith('test medicine 1', 'tst-med-1');
	});
});
