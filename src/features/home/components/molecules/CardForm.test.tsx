import CardForm from '@/features/home/components/molecules/CardForm';
import { CARD_TYPES, CHART_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/event/card';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/user/use-user', () => ({
	useUser: () => ({
		userMedicineOptions: [
			{
				label: 'Test medicine 1',
				value: 'tst_med_1',
			},
		],
	}),
}));
vi.mock('@/features/home/hooks/use-card-setups', () => ({
	useCardSetups: () => ({
		cardSetups: [
			{
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
				timeframe: {
					count: 2,
					unit: TIME_FRAME_UNITS.MONTHS,
				},
			},
		],
	}),
}));

describe('<CardForm />', () => {
	const user = userEvent.setup();
	const defaultProps = {
		onButtonClick: vi.fn(),
	};

	it('renders input fields and filter form', () => {
		render(<CardForm {...defaultProps} />);

		expect(screen.getByLabelText('Title')).toBeInTheDocument();
		expect(screen.getByLabelText('Card Type')).toBeInTheDocument();
		expect(screen.getByLabelText('Chart Type')).toBeInTheDocument();
		expect(screen.getByTestId('filter-form')).toBeInTheDocument();
		expect(screen.getByLabelText('Value')).toBeInTheDocument();
		expect(screen.getByLabelText('Unit')).toBeInTheDocument();
		expect(screen.getByText('Submit')).toBeInTheDocument();
	});

	it('calls onButtonClick on click on submit if fields are valid', async () => {
		const mockOnButtonClick = vi.fn();
		render(<CardForm {...defaultProps} onButtonClick={mockOnButtonClick} />);

		await user.type(screen.getByLabelText('Title'), 'Test title');
		await user.type(screen.getByLabelText('Value'), '2');

		await user.click(screen.getByText('Submit'));

		expect(mockOnButtonClick).toHaveBeenCalled();
	});

	it('does not call onButtonClick on click on submit if fields are empty', async () => {
		const mockOnButtonClick = vi.fn();
		render(<CardForm {...defaultProps} onButtonClick={mockOnButtonClick} />);

		await user.click(screen.getByText('Submit'));

		expect(mockOnButtonClick).not.toHaveBeenCalled();
	});

	it('calls onButtonClick with correct CardSetup', async () => {
		const mockOnButtonClick = vi.fn();
		render(<CardForm {...defaultProps} onButtonClick={mockOnButtonClick} />);

		await user.type(screen.getByLabelText('Title'), 'Test title');
		await user.clear(screen.getByLabelText('Value'));
		await user.type(screen.getByLabelText('Value'), '2');
		await user.click(screen.getByText('Submit'));

		expect(mockOnButtonClick).toHaveBeenCalledWith(
			expect.objectContaining({
				title: 'Test title',
				cardType: CARD_TYPES.MIGRAINE,
				chartType: CHART_TYPES.AREA,
				timeframe: { count: 2, unit: TIME_FRAME_UNITS.MONTHS },
			}),
		);
	});

	it('passes default props down to childs', async () => {
		render(
			<CardForm
				{...defaultProps}
				defaultTitle='Test title'
				defaultCount={7}
				defaultCardType={CARD_TYPES.DURATION}
				defaultChartType={CHART_TYPES.PIE}
				defaultUnit={TIME_FRAME_UNITS.DAYS}
			/>,
		);

		expect(screen.getByLabelText('Title')).toHaveValue('Test title');
		expect(screen.getByLabelText('Card Type')).toHaveValue(CARD_TYPES.DURATION);
		expect(screen.getByLabelText('Chart Type')).toHaveValue(CHART_TYPES.PIE);
		expect(screen.getByLabelText('Value')).toHaveValue(7);
		expect(screen.getByLabelText('Unit')).toHaveValue(TIME_FRAME_UNITS.DAYS);
	});
});
