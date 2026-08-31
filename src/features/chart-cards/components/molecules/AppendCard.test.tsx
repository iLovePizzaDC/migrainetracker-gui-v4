import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AppendCard from '@/features/chart-cards/components/molecules/AppendCard';

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
vi.mock('@/features/chart-cards/hooks/use-card-setups', () => ({
	useCardSetups: () => ({
		appendSetup: vi.fn(),
	}),
}));

describe('<AppendCard />', () => {
	const user = userEvent.setup();

	it('renders title', () => {
		render(<AppendCard />);

		expect(screen.getByText('Add more')).toBeInTheDocument();
	});

	it('is collapsed by default', () => {
		render(<AppendCard />);

		expect(screen.getByTestId('card-form-wrapper')).toHaveClass('grid-rows-[0fr]');
	});

	it('expands on click on "Add more"', async () => {
		render(<AppendCard />);

		await user.click(screen.getByText('Add more'));

		expect(screen.getByTestId('card-form-wrapper')).toHaveClass('grid-rows-[1fr]');
		expect(screen.getByLabelText('Title')).toBeInTheDocument();
	});

	it('collapses on second click', async () => {
		render(<AppendCard />);

		await user.click(screen.getByText('Add more'));
		await user.click(screen.getByText('Add more'));

		expect(screen.getByTestId('card-form-wrapper')).toHaveClass('grid-rows-[0fr]');
	});
});
