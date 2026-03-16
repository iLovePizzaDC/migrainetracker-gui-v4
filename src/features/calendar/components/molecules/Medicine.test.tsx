import Medicine from '@/features/calendar/components/molecules/Medicine';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const medLabel = 'test medicine';
const medValue = 'tst-med';

vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: () => ({
		medDaysCount: 10,
		maxMedDaysCount: 5,
	}),
}));

vi.mock('@/shared/hooks/use-click-outside', () => ({
	useClickOutside: vi.fn(),
}));

vi.mock('@/features/calendar/components/molecules/MedicineCombobox', () => ({
	default: ({ medicines, disabled }: any) => (
		<div data-testid='medicine-combobox'>
			{medicines.map((m: any) => (
				<span key={m.medicine.abbreviation}>{m.medicine.label}</span>
			))}
			{disabled && <span data-testid='combobox-disabled' />}
		</div>
	),
}));

vi.mock('@/features/calendar/components/molecules/AddMedicineForm', () => ({
	default: ({ show }: any) => (show ? <div data-testid='add-medicine-form' /> : null),
}));

vi.mock('@/features/calendar/components/atoms/Slider', () => ({
	default: ({ label, onChange, disabled }: any) => (
		<input
			aria-label={label}
			type='range'
			onChange={(e) => onChange(Number(e.target.value))}
			disabled={disabled}
		/>
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

describe('<Medicine />', () => {
	it('renders the heading', () => {
		render(<Medicine medicines={medicines} setMedicines={setMedicines} />);

		expect(screen.getByText('Medicines')).toBeInTheDocument();
	});
});
