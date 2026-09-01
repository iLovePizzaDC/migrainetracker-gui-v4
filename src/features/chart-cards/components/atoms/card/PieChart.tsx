import { PIE_COLORS } from '@/features/chart-cards/constants/pie-colors';
import { CHART_TOOLTIP_STYLE } from '@/shared/constants/style/chart-tooltip';
import type { ChartData } from '@/shared/types/chart';
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface IPieChart {
	outerData: ChartData;
	innerData?: ChartData;
}

function PieChart({ outerData, innerData }: IPieChart) {
	return (
		<ResponsiveContainer width='100%' height='100%'>
			<RePieChart>
				<Tooltip
					contentStyle={CHART_TOOLTIP_STYLE}
					itemStyle={{ color: 'rgba(255,255,255,0.85)' }}
					labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
				/>
				<Pie
					data={outerData}
					dataKey='value'
					innerRadius='62%'
					outerRadius='78%'
					paddingAngle={1}
					stroke='transparent'
				>
					{outerData.map((_, index) => (
						<Cell key={index} fill={PIE_COLORS[index]} />
					))}
				</Pie>
				{innerData && (
					<Pie
						data={innerData}
						dataKey='value'
						innerRadius='42%'
						outerRadius='54%'
						paddingAngle={1}
						stroke='transparent'
						isAnimationActive
					>
						{innerData.map((_, index) => (
							<Cell key={index} fill={PIE_COLORS[index]} />
						))}
					</Pie>
				)}
			</RePieChart>
		</ResponsiveContainer>
	);
}

export default PieChart;
