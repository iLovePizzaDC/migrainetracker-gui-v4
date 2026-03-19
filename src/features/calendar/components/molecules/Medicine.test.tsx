import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockMedLabel = 'test medicine';
const mockMedValue = 'tst_med';

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

const mockMedicines = [
	{
		medicine: {
			abbreviation: `${mockMedValue}_1`,
			label: `${mockMedLabel} 1`,
		},
		taken: 1,
		effectiveness: 0,
	},
];

const mockSetMedicines = vi.fn();

const mockUseCalendar = (medDaysCount: number, maxMedDaysCount: number) => {
	vi.doMock('@/features/calendar/hooks/use-calendar', () => ({
		useCalendar: () => ({ medDaysCount, maxMedDaysCount }),
	}));
};

describe('<Medicine />', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		mockSetMedicines.mockClear();
		vi.resetModules();
	});

	const scenarios = [
		{ days: 5, max: 10, color: 'text-green-500' },
		{ days: 10, max: 10, color: 'text-yellow-500' },
		{ days: 15, max: 10, color: 'text-red-500' },
	];

	it.each(scenarios)(
		'renders med-days $days/$max with color $color',
		async ({ days, max, color }) => {
			mockUseCalendar(days, max);
			const { default: Medicine } =
				await import('@/features/calendar/components/molecules/Medicine');
			render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

			const medDaysSpan = screen.getByTestId('med-days-count');
			expect(medDaysSpan).toHaveTextContent(`${days}`);
			expect(medDaysSpan).toHaveClass(color);
		},
	);

	it('renders the heading', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		expect(screen.getByText('Medicines')).toBeInTheDocument();
	});

	it('renders med-days label with correct values', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		expect(screen.getByText('5')).toBeInTheDocument();
		expect(screen.getByText('/10 Med-Days this month')).toBeInTheDocument();
	});

	it('renders medicines with correct values', async () => {
		mockUseCalendar(15, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		expect(screen.getByRole('slider', { name: /Taken/ })).toHaveAttribute('value', '1');
		expect(screen.getByRole('slider', { name: /Effectiveness/ })).toHaveAttribute('value', '0');
	});

	it('does not render info popup by default', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		expect(screen.queryByText('MOH')).not.toBeInTheDocument();
	});

	it('renders info popup on info button click', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		await user.click(screen.getByTestId('info-toggle'));

		expect(screen.getByText('MOH')).toBeInTheDocument();
	});

	it('does not render add medicine form by default', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		expect(screen.queryByTestId('add-medicine-form')).toHaveStyle('height: 0');
	});

	it('renders add medicine form on first button click', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		await user.click(screen.getByTestId('add-medicine'));

		expect(screen.getByTestId('add-medicine-form')).toBeInTheDocument();
	});

	it('closes add medicine form on second button click', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		await user.click(screen.getByTestId('add-medicine'));
		await user.click(screen.getByTestId('add-medicine'));

		expect(screen.queryByTestId('add-medicine-form')).toHaveStyle('height: 0');
	});

	it('calls setMedicines with correct taken value on slider change', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		fireEvent.change(screen.getByRole('slider', { name: /Taken/ }), { target: { value: 8 } });

		const updated = [...mockMedicines];
		updated[0].taken = 8;
		expect(mockSetMedicines).toHaveBeenCalledWith(updated);
	});

	it('calls setMedicines with correct effectiveness value on slider change', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} />);

		fireEvent.change(screen.getByRole('slider', { name: /Effectiveness/ }), {
			target: { value: 1 },
		});

		const updated = [...mockMedicines];
		updated[0].taken = 1;
		expect(mockSetMedicines).toHaveBeenCalledWith(updated);
	});

	it('adapts effectiveness max value on taken slider change', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');

		let testMedicines = [...mockMedicines];

		const handleSetMedicines: React.Dispatch<React.SetStateAction<typeof mockMedicines>> = (
			value,
		) => {
			testMedicines = typeof value === 'function' ? value(testMedicines) : value;

			rerender(<Medicine medicines={testMedicines} setMedicines={handleSetMedicines} />);
		};

		const { rerender } = render(
			<Medicine medicines={testMedicines} setMedicines={handleSetMedicines} />,
		);

		fireEvent.change(screen.getByRole('slider', { name: /Taken/ }), {
			target: { value: 3 },
		});

		expect(screen.getByRole('slider', { name: /Effectiveness/ })).toHaveAttribute('max', '3');
	});

	it('is disabled if prop is true', async () => {
		mockUseCalendar(5, 10);
		const { default: Medicine } = await import('@/features/calendar/components/molecules/Medicine');
		render(<Medicine medicines={mockMedicines} setMedicines={mockSetMedicines} disabled />);

		expect(screen.getByTestId('combobox-disabled')).toBeInTheDocument();
		expect(screen.getByRole('slider', { name: /Taken/ })).toBeDisabled();
		expect(screen.getByRole('slider', { name: /Effectiveness/ })).toBeDisabled();
	});
});
