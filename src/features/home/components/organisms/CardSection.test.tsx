import CardSection from '@/features/home/components/organisms/CardSection';
import { useCardSetups } from '@/features/home/hooks/use-card-setups';
import { CARD_TYPES, CHART_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/event/card';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/features/home/hooks/use-card-setups');
vi.mock('@/features/home/components/molecules/ChartCard', () => ({
  default: ({ title }: any) => <div data-testid='chart-card'>{title}</div>,
}));
vi.mock('@/features/home/components/molecules/MidasCard', () => ({
  default: () => <div data-testid='midas-card' />,
}));
vi.mock('@/features/home/components/molecules/AppendCard', () => ({
  default: () => <div data-testid='append-card' />,
}));

const mockDefaultSetup = {
  index: 0,
  title: 'Test Card',
  cardType: CARD_TYPES.MIGRAINE,
  chartType: CHART_TYPES.AREA,
  filter: { intensity: null, symptom: [], medicine: [], effectiveness: null, midas: [] },
  timeframe: { count: 12, unit: TIME_FRAME_UNITS.MONTHS },
};

describe('<CardSection />', () => {
  it('renders MidasCard and AppendCard', () => {
    vi.mocked(useCardSetups).mockReturnValue({ cardSetups: [] } as any);
    render(<CardSection />);

    expect(screen.getByTestId('midas-card')).toBeInTheDocument();
    expect(screen.getByTestId('append-card')).toBeInTheDocument();
  });

  it('renders a ChartCard for each setup', () => {
    vi.mocked(useCardSetups).mockReturnValue({
      cardSetups: [
        { ...mockDefaultSetup, index: 0, title: 'Card A' },
        { ...mockDefaultSetup, index: 1, title: 'Card B' },
      ],
    } as any);

    render(<CardSection />);

    expect(screen.getAllByTestId('chart-card')).toHaveLength(2);
    expect(screen.getByText('Card A')).toBeInTheDocument();
    expect(screen.getByText('Card B')).toBeInTheDocument();
  });

  it('renders no ChartCards when cardSetups is empty', () => {
    vi.mocked(useCardSetups).mockReturnValue({ cardSetups: [] } as any);
    render(<CardSection />);

    expect(screen.queryByTestId('chart-card')).not.toBeInTheDocument();
  });

  it('renders ChartCards sorted by index', () => {
    vi.mocked(useCardSetups).mockReturnValue({
      cardSetups: [
        { ...mockDefaultSetup, index: 2, title: 'Card C' },
        { ...mockDefaultSetup, index: 0, title: 'Card A' },
        { ...mockDefaultSetup, index: 1, title: 'Card B' },
      ],
    } as any);

    render(<CardSection />);

    const cards = screen.getAllByTestId('chart-card');
    expect(cards[0]).toHaveTextContent('Card A');
    expect(cards[1]).toHaveTextContent('Card B');
    expect(cards[2]).toHaveTextContent('Card C');
  });
});
