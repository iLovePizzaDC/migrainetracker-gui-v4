import AppendCard from '@/features/home/components/molecules/AppendCard';
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

		expect(screen.getByTestId('card-form-wrapper')).toHaveClass('grid-rows-[0fr]', 'opacity-0');
	});

	it('expands on click on "Add more"', async () => {
		render(<AppendCard />);

		await user.click(screen.getByText('Add more'));

		expect(screen.getByTestId('card-form-wrapper')).toHaveClass('grid-rows-[1fr]', 'opacity-100');
	});

	it('collapses on second click', async () => {
		render(<AppendCard />);

		await user.click(screen.getByText('Add more'));
		await user.click(screen.getByText('Add more'));

		expect(screen.getByTestId('card-form-wrapper')).toHaveClass('grid-rows-[0fr]', 'opacity-0');
	});
});
