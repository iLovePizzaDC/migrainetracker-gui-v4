import MidasCard from '@/features/home/components/molecules/MidasCard';
import { fetchMidasPieData } from '@/features/home/utils/fetch-helper';
import { useUser } from '@/shared/hooks/user/use-user';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/user/use-user', () => ({
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
vi.mock('@/features/home/utils/fetch-helper', () => ({
	fetchMidasPieData: vi.fn(),
}));
vi.mock('@/features/home/components/atoms/card/PieChart', () => ({
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
			vi.mocked(useUser).mockReturnValueOnce({ user: null, setUser: vi.fn(), medicines: null });
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

			expect(await screen.findByText('not/little')).toBeInTheDocument();
			expect(await screen.findByText('not/little')).toHaveClass(
				'bg-gradient-to-r',
				'from-gray-500/0',
				'to-gray-500/70',
			);
		});

		it('shows "mild" label for score >= 6', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData(6));
			render(<MidasCard />);

			expect(await screen.findByText('mild')).toBeInTheDocument();
			expect(await screen.findByText('mild')).toHaveClass(
				'bg-gradient-to-r',
				'from-yellow-500/0',
				'to-yellow-500/70',
			);
		});

		it('shows "moderate" label for score >= 11', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData(11));
			render(<MidasCard />);

			expect(await screen.findByText('moderate')).toBeInTheDocument();
			expect(await screen.findByText('moderate')).toHaveClass(
				'bg-gradient-to-r',
				'from-orange-500/0',
				'to-orange-500/70',
			);
		});

		it('shows "severe" label for score >= 21', async () => {
			vi.mocked(fetchMidasPieData).mockReturnValue(mockFetchMidasPieData(21));
			render(<MidasCard />);

			expect(await screen.findByText('severe')).toBeInTheDocument();
			expect(await screen.findByText('severe')).toHaveClass(
				'bg-gradient-to-r',
				'from-red-500/0',
				'to-red-500/70',
			);
		});
	});
});
