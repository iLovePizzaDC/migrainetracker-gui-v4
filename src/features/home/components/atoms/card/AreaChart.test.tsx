import AreaChart from '@/features/home/components/atoms/card/AreaChart';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('recharts', () => ({
	ResponsiveContainer: ({ children }: any) => (
		<div data-testid='responsive-container'>{children}</div>
	),
	AreaChart: ({ children, data }: any) => (
		<div data-testid='recharts-area-chart' data-length={data?.length}>
			{children}
		</div>
	),
	Area: (props: any) => <div data-testid='area' data-datakey={props.dataKey} />,
	XAxis: (props: any) => <div data-testid='xaxis' data-interval={props.interval} />,
	YAxis: () => <div data-testid='yaxis' />,
	Tooltip: () => <div data-testid='tooltip' />,
	ReferenceLine: (props: any) => <div data-testid='reference-line' data-y={props.y} />,
	defs: ({ children }: any) => <>{children}</>,
	linearGradient: ({ children }: any) => <>{children}</>,
	stop: () => null,
}));

const mockData = [
	{ name: 'Jan', value: 5 },
	{ name: 'Feb', value: 3 },
	{ name: 'Mar', value: 8 },
];

describe('<AreaChart />', () => {
	it('renders without crashing', () => {
		render(<AreaChart data={mockData} />);
		expect(screen.getByTestId('recharts-area-chart')).toBeInTheDocument();
	});

	it('passes data to the chart', () => {
		render(<AreaChart data={mockData} />);
		expect(screen.getByTestId('recharts-area-chart')).toHaveAttribute('data-length', '3');
	});

	it('renders Area with dataKey "value"', () => {
		render(<AreaChart data={mockData} />);
		expect(screen.getByTestId('area')).toHaveAttribute('data-datakey', 'value');
	});

	it('calculates XAxis interval based on data length', () => {
		render(<AreaChart data={mockData} />);
		const expected = Math.floor(mockData.length / 5);
		expect(screen.getByTestId('xaxis')).toHaveAttribute('data-interval', String(expected));
	});

	it('does not render ReferenceLine when showThresholdLine is false', () => {
		render(<AreaChart data={mockData} showThresholdLine={false} thresholdY={10} />);
		expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument();
	});

	it('does not render ReferenceLine when thresholdY is missing', () => {
		render(<AreaChart data={mockData} showThresholdLine />);
		expect(screen.queryByTestId('reference-line')).not.toBeInTheDocument();
	});

	it('renders ReferenceLine with correct y when both props are set', () => {
		render(<AreaChart data={mockData} showThresholdLine thresholdY={10} />);
		expect(screen.getByTestId('reference-line')).toHaveAttribute('data-y', '10');
	});
});
