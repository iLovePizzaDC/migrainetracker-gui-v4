import ChartCard from '@/features/chart-cards/components/molecules/ChartCard';
import { useChartData } from '@/features/chart-cards/hooks/use-chart-data';
import { CARD_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/chart-cards/cards';
import { CHART_TYPES } from '@/shared/constants/chart-cards/charts';
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

vi.mock('@/shared/hooks/use-user', () => ({
	useUser: () => ({
		medicines: mockUserMedicines,
	}),
}));

const mockRemoveSetupByIndex = vi.fn();
const mockUpdateSetupByIndex = vi.fn();

vi.mock('@/features/chart-cards/hooks/use-card-setups', () => ({
	useCardSetups: () => ({
		removeSetupByIndex: mockRemoveSetupByIndex,
		updateSetupByIndex: mockUpdateSetupByIndex,
	}),
}));
vi.mock('@/features/chart-cards/hooks/use-chart-data', () => ({
	useChartData: vi.fn(() => ({
		isLoading: false,
		areaData: [
			{ name: 'Jan.', value: 12 },
			{ name: 'Feb.', value: 8 },
		],
		pieData: [
			{ name: 'Migraine', value: 5 },
			{ name: 'No Migraine', value: 3 },
		],
		currentPieValue: 5,
		totalPieValue: 8,
	})),
}));
vi.mock('@/features/chart-cards/components/atoms/card/AreaChart', () => ({
	default: () => <div data-testid='area-chart' />,
}));
vi.mock('@/features/chart-cards/components/atoms/card/PieChart', () => ({
	default: () => <div data-testid='pie-chart' />,
}));

describe('<ChartCard /', () => {
	const user = userEvent.setup();
	const defaultProps = {
		index: 0,
		title: 'Test title',
		cardType: CARD_TYPES.MIGRAINE,
		chartType: CHART_TYPES.AREA,
		filter: {
			intensity: null,
			symptom: [],
			medicine: [],
			effectiveness: null,
			midas: [],
		},
		timeframeCount: 2,
		timeframeUnit: TIME_FRAME_UNITS.MONTHS,
	};

	beforeEach(() => {
		mockRemoveSetupByIndex.mockClear();
		mockUpdateSetupByIndex.mockClear();
	});

	describe('rendering', () => {
		it('renders title', () => {
			render(<ChartCard {...defaultProps} />);

			expect(screen.getByText('Test title')).toBeInTheDocument();
		});

		it('renders context button', () => {
			render(<ChartCard {...defaultProps} />);

			expect(screen.getByTestId('context-button')).toBeInTheDocument();
		});

		it('renders area chart when chartType is AREA', () => {
			render(<ChartCard {...defaultProps} />);

			expect(screen.getByTestId('area-chart')).toBeInTheDocument();
		});

		it('renders pie chart when chartType is PIE', () => {
			render(<ChartCard {...defaultProps} chartType={CHART_TYPES.PIE} />);

			expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
		});

		it('renders loading skeleton when isLoading is true', () => {
			vi.mocked(useChartData).mockImplementationOnce(() => ({
				isLoading: true,
				areaData: [],
				pieData: [],
				currentPieValue: 0,
				totalPieValue: 0,
			}));

			render(<ChartCard {...defaultProps} />);

			expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
		});

		it('renders pie value summary when chartType is PIE and totalPieValue > 0', () => {
			render(<ChartCard {...defaultProps} chartType={CHART_TYPES.PIE} />);

			expect(screen.getByText('5/8 days')).toBeInTheDocument();
		});

		it('renders "days" for non-DURATION card type', () => {
			render(
				<ChartCard {...defaultProps} chartType={CHART_TYPES.PIE} cardType={CARD_TYPES.MEDICINE} />,
			);

			expect(screen.getByText('5 medicines')).toBeInTheDocument();
		});

		it('renders "hours" for DURATION card type', () => {
			render(
				<ChartCard {...defaultProps} chartType={CHART_TYPES.PIE} cardType={CARD_TYPES.DURATION} />,
			);

			expect(screen.getByText('5/8 hours')).toBeInTheDocument();
		});

		it('does not render pie value summary when totalPieValue is 0', () => {
			vi.mocked(useChartData).mockImplementationOnce(() => ({
				isLoading: true,
				areaData: [],
				pieData: [],
				currentPieValue: 0,
				totalPieValue: 0,
			}));

			render(<ChartCard {...defaultProps} chartType={CHART_TYPES.PIE} />);

			expect(screen.queryByText('5/8 days')).not.toBeInTheDocument();
		});

		it('does not render CardForm by default', () => {
			render(<ChartCard {...defaultProps} />);

			expect(screen.getByTestId('chart-card-reveal')).toHaveClass('grid-rows-[auto]');
			expect(screen.queryByLabelText('Title')).not.toBeInTheDocument();
		});
	});

	describe('context menu', () => {
		it('opens context menu on context button click', async () => {
			render(<ChartCard {...defaultProps} />);

			expect(screen.queryByTestId('context-menu')).not.toBeInTheDocument();

			await user.click(screen.getByTestId('context-button'));

			expect(screen.getByTestId('context-menu')).toBeInTheDocument();
		});
	});

	describe('editing', () => {
		it('shows CardForm when isEditing is true', async () => {
			render(<ChartCard {...defaultProps} />);

			await user.click(screen.getByTestId('context-button'));
			await user.click(screen.getByText('Edit'));

			expect(screen.getByTestId('chart-card-reveal')).toHaveClass('grid-rows-[minmax(0,0fr)_auto]');
			expect(screen.getByLabelText('Title')).toBeVisible();
		});

		it('calls updateSetupByIndex when CardForm is submitted', async () => {
			render(<ChartCard {...defaultProps} />);

			await user.click(screen.getByTestId('context-button'));
			await user.click(screen.getByText('Edit'));
			await user.click(screen.getByText('Submit'));

			expect(mockUpdateSetupByIndex).toHaveBeenCalled();
		});

		it('resets form to stored values after editing and cancelling', async () => {
			render(<ChartCard {...defaultProps} />);

			await user.click(screen.getByTestId('context-button'));
			await user.click(screen.getByText('Edit'));

			const titleInput = screen.getByLabelText('Title');
			await user.clear(titleInput);
			await user.type(titleInput, 'Changed title');
			expect(titleInput).toHaveValue('Changed title');

			await user.click(screen.getByTestId('context-button'));
			await user.click(screen.getByText('Cancel'));

			await user.click(screen.getByTestId('context-button'));
			await user.click(screen.getByText('Edit'));

			expect(screen.getByLabelText('Title')).toHaveValue('Test title');
		});
	});

	describe('remove', () => {
		it('calls removeSetupByIndex with correct index on remove', async () => {
			render(<ChartCard {...defaultProps} />);

			await user.click(screen.getByTestId('context-button'));
			await user.click(screen.getByText('Remove'));
			await user.click(screen.getByText('Are you sure?'));

			expect(mockRemoveSetupByIndex).toHaveBeenCalled();
		});
	});

	describe('useChartData args', () => {
		it('passes correct props to useChartData', () => {
			render(<ChartCard {...defaultProps} />);

			expect(useChartData).toHaveBeenCalledWith(
				CARD_TYPES.MIGRAINE,
				CHART_TYPES.AREA,
				defaultProps.filter,
				2,
				TIME_FRAME_UNITS.MONTHS,
			);
		});
	});
});
