import FilterForm from '@/shared/components/molecules/FilterForm';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import { FILTER_FORM_VARIANTS } from '@/shared/constants/variants/filter-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

vi.mock('@/shared/hooks/use-user', () => ({
	useUser: () => ({
		medicines: mockUserMedicines,
	}),
}));

const mockDefaultFilter = {
	intensity: null,
	symptom: [],
	medicine: [],
	effectiveness: null,
	midas: [],
};

describe('<FilterForm />', () => {
	const user = userEvent.setup();

	const defaultProps = {
		variant: FILTER_FORM_VARIANTS.STANDARD,
		filter: mockDefaultFilter,
		setFilter: vi.fn(),
	};

	async function openFilters() {
		await user.click(screen.getByRole('button', { name: /filters/i }));
	}

	afterEach(() => vi.clearAllMocks());

	describe('rendering', () => {
		it('renders filter form container', () => {
			render(<FilterForm {...defaultProps} />);

			expect(screen.getByTestId('filter-form')).toBeInTheDocument();
		});

		it('renders toggle button for standard variant', () => {
			render(<FilterForm {...defaultProps} />);

			expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
		});

		it('renders intensity dropdown after opening filters', async () => {
			render(<FilterForm {...defaultProps} />);

			await openFilters();

			expect(screen.getByLabelText('Intensity')).toBeInTheDocument();
		});

		it('renders symptoms combobox after opening filters', async () => {
			render(<FilterForm {...defaultProps} />);

			await openFilters();

			expect(screen.getByLabelText('Symptoms')).toBeInTheDocument();
		});

		it('renders medicine combobox when medicineInputVisible is true', async () => {
			render(<FilterForm {...defaultProps} medicineInputVisible />);

			await openFilters();

			expect(screen.getByLabelText('Medicine')).toBeInTheDocument();
			expect(screen.getByLabelText('Effectiveness')).toBeInTheDocument();
		});

		it('hides medicine combobox when medicineInputVisible is false', async () => {
			render(<FilterForm {...defaultProps} medicineInputVisible={false} />);

			await openFilters();

			expect(screen.queryByLabelText('Medicine')).not.toBeInTheDocument();
			expect(screen.queryByLabelText('Effectiveness')).not.toBeInTheDocument();
		});

		it('renders midas combobox when midasInputVisible is true', async () => {
			render(<FilterForm {...defaultProps} midasInputVisible />);

			await openFilters();

			expect(screen.getByLabelText('Midas')).toBeInTheDocument();
		});

		it('hides midas combobox when midasInputVisible is false', async () => {
			render(<FilterForm {...defaultProps} midasInputVisible={false} />);

			await openFilters();

			expect(screen.queryByLabelText('Midas')).not.toBeInTheDocument();
		});
	});

	describe('variants', () => {
		it('does not render toggle button in compact variant', () => {
			render(<FilterForm {...defaultProps} variant={FILTER_FORM_VARIANTS.COMPACT} />);

			expect(screen.queryByRole('button', { name: /filters/i })).not.toBeInTheDocument();
		});

		it('renders filters immediately in compact variant', () => {
			render(<FilterForm {...defaultProps} variant={FILTER_FORM_VARIANTS.COMPACT} />);

			expect(screen.getByLabelText('Intensity')).toBeInTheDocument();
			expect(screen.getByLabelText('Symptoms')).toBeInTheDocument();
		});

		it('applies standard classes', () => {
			render(<FilterForm {...defaultProps} variant={FILTER_FORM_VARIANTS.STANDARD} />);

			expect(screen.getByTestId('filter-form')).toHaveClass(
				'rounded-xl',
				'border',
				'border-white/10',
				'bg-white/5',
			);
		});
	});

	describe('interactions', () => {
		it('opens filters when toggle button is clicked', async () => {
			render(<FilterForm {...defaultProps} />);

			await openFilters();

			expect(screen.getByLabelText('Intensity')).toBeInTheDocument();
		});

		it('calls setFilter when intensity changes', async () => {
			const setFilter = vi.fn();

			render(<FilterForm {...defaultProps} setFilter={setFilter} />);

			await openFilters();

			await user.click(screen.getAllByTestId('dropdown-menu-trigger')[0]);
			await user.click(screen.getByTestId('high'));

			expect(setFilter).toHaveBeenCalled();
		});

		it('calls setFilter when effectiveness changes', async () => {
			const setFilter = vi.fn();

			render(<FilterForm {...defaultProps} setFilter={setFilter} medicineInputVisible />);

			await openFilters();

			await user.click(screen.getAllByTestId('dropdown-menu-trigger')[1]);
			await user.click(screen.getByTestId('yes'));

			expect(setFilter).toHaveBeenCalled();
		});

		it('calls setFilter with null when intensity is set to ANY', async () => {
			const setFilter = vi.fn();
			const filterWithIntensity = {
				...mockDefaultFilter,
				intensity: 'high' as any,
			};

			render(<FilterForm {...defaultProps} filter={filterWithIntensity} setFilter={setFilter} />);

			await openFilters();

			await user.click(screen.getAllByTestId('dropdown-menu-trigger')[0]);
			await user.click(screen.getByTestId('any'));

			expect(setFilter).toHaveBeenCalledWith(expect.any(Function));

			const updater = setFilter.mock.calls[0][0];
			const result = updater(filterWithIntensity);

			expect(result.intensity).toBeNull();
		});
	});
});
