import FilterCard from '@/features/calendar/components/molecules/FilterCard';
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
vi.mock('@/features/calendar/hooks/use-calendar', () => ({
	useCalendar: () => ({
		filter: {
			intensity: null,
			symptom: [],
			medicine: [],
			effectiveness: null,
			midas: [],
		},
		setFilter: vi.fn(),
	}),
}));
vi.mock('@/shared/hooks/use-click-outside', () => ({
	useClickOutside: () => vi.fn(),
}));

describe('<FilterCard />', () => {
	const user = userEvent.setup();

	it('renders the select input, toggle and the close buttons', () => {
		render(<FilterCard />);

		expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
		expect(screen.getByTestId('close-button')).toBeInTheDocument();
		expect(screen.getByTestId('filter-card')).toHaveClass('opacity-0', 'pointer-events-none');
	});

	it('renders the filter card on first toggle button click', async () => {
		render(<FilterCard />);

		await user.click(screen.getByTestId('toggle-button'));

		expect(screen.getByTestId('filter-card')).toHaveClass('opacity-100');
	});

	it('closes the filter card on second toggle button click', async () => {
		render(<FilterCard />);

		await user.click(screen.getByTestId('toggle-button'));
		await user.click(screen.getByTestId('toggle-button'));

		expect(screen.getByTestId('filter-card')).toHaveClass('opacity-0');
	});

	it('closes the filter card on close button click', async () => {
		render(<FilterCard />);

		await user.click(screen.getByTestId('close-button'));

		expect(screen.getByTestId('filter-card')).toHaveClass('opacity-0');
	});
});
