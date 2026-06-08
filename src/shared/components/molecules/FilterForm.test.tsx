import FilterForm from '@/shared/components/molecules/FilterForm';
import { FILTER_FORM_VARIANTS } from '@/shared/constants/variants/filter-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/user/use-user-medicines', () => ({
	useUserMedicines: vi.fn(() => ({
		userMedicineOptions: [{ label: 'Ibuprofen', value: 'ibu' }],
	})),
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

	afterEach(() => vi.clearAllMocks());

	describe('rendering', () => {
		it('renders filter form container', () => {
			render(<FilterForm {...defaultProps} />);

			expect(screen.getByTestId('filter-form')).toBeInTheDocument();
		});

		it('renders intensity dropdown', () => {
			render(<FilterForm {...defaultProps} />);

			expect(screen.getByLabelText('Intensity')).toBeInTheDocument();
		});

		it('renders symptoms combobox', () => {
			render(<FilterForm {...defaultProps} />);

			expect(screen.getByLabelText('Symptoms')).toBeInTheDocument();
		});

		it('renders medicine combobox when medicineInputVisible is true', () => {
			render(<FilterForm {...defaultProps} medicineInputVisible />);

			expect(screen.getByLabelText('Medicine')).toBeInTheDocument();
			expect(screen.getByLabelText('Effectiveness')).toBeInTheDocument();
		});

		it('hides medicine combobox when medicineInputVisible is false', () => {
			render(<FilterForm {...defaultProps} medicineInputVisible={false} />);

			expect(screen.queryByLabelText('Medicine')).not.toBeInTheDocument();
			expect(screen.queryByLabelText('Effectiveness')).not.toBeInTheDocument();
		});

		it('renders midas combobox when midasInputVisible is true', () => {
			render(<FilterForm {...defaultProps} midasInputVisible />);

			expect(screen.getByLabelText('Midas')).toBeInTheDocument();
		});

		it('hides midas combobox when midasInputVisible is false', () => {
			render(<FilterForm {...defaultProps} midasInputVisible={false} />);

			expect(screen.queryByLabelText('Midas')).not.toBeInTheDocument();
		});
	});

	describe('variants', () => {
		it('applies compact classes for COMPACT variant', () => {
			render(<FilterForm {...defaultProps} variant={FILTER_FORM_VARIANTS.COMPACT} />);

			expect(screen.getByTestId('filter-form')).toHaveClass('space-y-2');
			expect(screen.getByTestId('filter-form')).not.toHaveClass('rounded-xl');
		});

		it('applies standard classes for STANDARD variant', () => {
			render(<FilterForm {...defaultProps} variant={FILTER_FORM_VARIANTS.STANDARD} />);

			expect(screen.getByTestId('filter-form')).toHaveClass('rounded-xl');
		});
	});

	describe('interactions', () => {
		it('calls setFilter when intensity changes', async () => {
			const setFilter = vi.fn();

			render(<FilterForm {...defaultProps} setFilter={setFilter} />);

			await user.click(screen.getAllByTestId('dropdown-menu-trigger')[0]);
			await user.click(screen.getByTestId('high'));

			expect(setFilter).toHaveBeenCalled();
		});

		it('calls setFilter when effectiveness changes', async () => {
			const setFilter = vi.fn();

			render(<FilterForm {...defaultProps} setFilter={setFilter} medicineInputVisible />);

			await user.click(screen.getAllByTestId('dropdown-menu-trigger')[1]);
			await user.click(screen.getByTestId('yes'));

			expect(setFilter).toHaveBeenCalled();
		});

		it('calls setFilter with null when intensity is set to ANY', async () => {
			const setFilter = vi.fn();
			const filterWithIntensity = { ...mockDefaultFilter, intensity: 'high' as any };

			render(<FilterForm {...defaultProps} filter={filterWithIntensity} setFilter={setFilter} />);

			await user.click(screen.getAllByTestId('dropdown-menu-trigger')[0]);
			await user.click(screen.getByTestId('any'));

			expect(setFilter).toHaveBeenCalledWith(expect.any(Function));

			const updater = setFilter.mock.calls[0][0];
			const result = updater(filterWithIntensity);
			expect(result.intensity).toBeNull();
		});
	});
});
