import PieChart from '@/features/home/components/atoms/card/PieChart';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('recharts', () => ({
	ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
	PieChart: ({ children }: any) => <div>{children}</div>,
	Pie: ({ data, innerRadius, outerRadius, children }: any) => (
		<div
			data-testid='pie'
			data-length={data?.length}
			data-inner={innerRadius}
			data-outer={outerRadius}
		>
			{children}
		</div>
	),
	Cell: ({ fill }: any) => <div data-testid='cell' data-fill={fill} />,
	Tooltip: () => <div data-testid='tooltip' />,
}));

const outerData = [
	{ name: 'A', value: 10 },
	{ name: 'B', value: 20 },
];

const innerData = [{ name: 'C', value: 5 }];

describe('<PieChart />', () => {
	it('renders without crashing', () => {
		render(<PieChart outerData={outerData} />);

		expect(screen.getByTestId('pie')).toBeInTheDocument();
	});

	it('renders outer Pie with correct data length', () => {
		render(<PieChart outerData={outerData} />);

		expect(screen.getAllByTestId('pie')[0]).toHaveAttribute('data-length', '2');
	});

	it('renders a Cell for each outer data entry', () => {
		render(<PieChart outerData={outerData} />);

		expect(screen.getAllByTestId('cell')).toHaveLength(outerData.length);
	});

	it('does not render inner Pie when innerData is not provided', () => {
		render(<PieChart outerData={outerData} />);

		expect(screen.getAllByTestId('pie')).toHaveLength(1);
	});

	it('renders inner Pie when innerData is provided', () => {
		render(<PieChart outerData={outerData} innerData={innerData} />);

		expect(screen.getAllByTestId('pie')).toHaveLength(2);
	});

	it('renders correct number of cells for inner and outer data combined', () => {
		render(<PieChart outerData={outerData} innerData={innerData} />);

		expect(screen.getAllByTestId('cell')).toHaveLength(outerData.length + innerData.length);
	});

	it('renders tooltip', () => {
		render(<PieChart outerData={outerData} />);

		expect(screen.getByTestId('tooltip')).toBeInTheDocument();
	});
});
