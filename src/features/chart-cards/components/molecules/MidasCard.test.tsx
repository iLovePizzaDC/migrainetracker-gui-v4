import MidasCard from '@/features/chart-cards/components/molecules/MidasCard';
import { fetchMidasPieData } from '@/features/chart-cards/utils/fetch-helper';
import { useUser } from '@/shared/hooks/use-user';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/use-user', () => ({
	useUser: vi.fn(() => ({
		user: {
			id: 'user01',
			email: 'email',
			name: 'username',
			given_name: 'given name',
			family_name: 'family name',
			picture: 'picture',
		},
	})),
}));
vi.mock('@/features/chart-cards/utils/fetch-helper', () => ({
	fetchMidasPieData: vi.fn(),
}));
vi.mock('@/features/chart-cards/components/atoms/card/PieChart', () => ({
	default: () => <div data-testid='pie-chart' />,
}));

const mockFetchMidasPieData = (currentScore = 7, previousScore = 5) =>
	Promise.resolve({
		current: {
			score: currentScore,
			pieData: [
				{ name: 'Current Score', value: currentScore },
				{ name: 'Remaining', value: 41 - currentScore },
			],
		},
		previous: {
			score: previousScore,
			pieData: [
				{ name: 'Previous Score', value: previousScore },
				{ name: 'Remaining', value: 41 - previousScore },
			],
		},
	});

describe('<MidasCard />', () => {
	describe('rendering', () => {
		it('renders heading', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData());
			render(<MidasCard />);

			expect(await screen.findByText('MIDAS Score')).toBeInTheDocument();
		});

		it('renders score after loading', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData());
			render(<MidasCard />);

			expect(await screen.findByText('7/270')).toBeInTheDocument();
		});

		it('renders nothing when user is null', () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData());
			vi.mocked(useUser).mockReturnValueOnce({
				user: null,
				setUser: vi.fn(),
				medicines: null,
				addMedicine: vi.fn(),
				removeMedicine: vi.fn(),
			});
			render(<MidasCard />);

			expect(screen.queryByText('MIDAS Score')).not.toBeInTheDocument();
		});

		it('renders nothing when midasScore is 0', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData(0));
			render(<MidasCard />);

			await waitFor(() => {
				expect(screen.queryByText('0/270')).not.toBeInTheDocument();
			});
		});
	});

	describe('color indicator', () => {
		it('shows "not/little" label for score < 6', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData(3));
			render(<MidasCard />);

			const label = await screen.findByText('not/little');
			expect(label).toBeInTheDocument();
			expect(label).toHaveClass('text-white/50');
		});

		it('shows "mild" label for score >= 6', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData(6));
			render(<MidasCard />);

			const label = await screen.findByText('mild');
			expect(label).toBeInTheDocument();
			expect(label).toHaveClass('text-yellow-200/90');
		});

		it('shows "moderate" label for score >= 11', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData(11));
			render(<MidasCard />);

			const label = await screen.findByText('moderate');
			expect(label).toBeInTheDocument();
			expect(label).toHaveClass('text-orange-300/90');
		});

		it('shows "severe" label for score >= 21', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData(21));
			render(<MidasCard />);

			const label = await screen.findByText('severe');
			expect(label).toBeInTheDocument();
			expect(label).toHaveClass('text-red-300/90');
		});
	});
});
