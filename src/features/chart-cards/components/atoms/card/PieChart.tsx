import { PIE_COLORS } from '@/features/chart-cards/constants/pie-colors';
import { FONT_FAMILY } from '@/shared/constants/style/font';
import type { ChartData } from '@/shared/types/chart';
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from 'recharts';

const CHART_TOOLTIP_STYLE = {
	background: 'rgba(10, 10, 10, 0.85)',
	backdropFilter: 'blur(12px)',
	border: '1px solid rgba(255, 255, 255, 0.12)',
	borderRadius: '12px',
	color: 'rgba(255, 255, 255, 0.9)',
	boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
	fontFamily: FONT_FAMILY,
	fontSize: 13,
	padding: '8px 12px',
};

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
