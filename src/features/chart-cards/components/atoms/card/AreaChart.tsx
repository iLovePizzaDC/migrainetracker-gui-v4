import { FONT_FAMILY } from '@/shared/constants/style/font';
import {
	Area,
	AreaChart as RAreaChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import type { ChartData } from 'recharts/types/state/chartDataSlice';

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

interface IAreaChart {
	data: ChartData;
	showThresholdLine?: boolean;
	thresholdY?: number;
}

function AreaChart({ data, showThresholdLine, thresholdY }: IAreaChart) {
	return (
		<ResponsiveContainer width='100%' height='100%'>
			<RAreaChart data={data} margin={{ top: 12, right: 4, left: 0, bottom: 0 }}>
				<defs>
					<linearGradient id='colorArea' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor='#ffffff' stopOpacity={0.25} />
						<stop offset='95%' stopColor='#ffffff' stopOpacity={0} />
					</linearGradient>
				</defs>

				<XAxis
					dataKey='name'
					tick={{ fill: 'rgba(255,255,255,0.4)', fontFamily: FONT_FAMILY, fontSize: 11 }}
					axisLine={false}
					tickLine={false}
					interval={Math.floor(data.length / 5)}
				/>

				<YAxis
					tick={{ fill: 'rgba(255,255,255,0.4)', fontFamily: FONT_FAMILY, fontSize: 11 }}
					axisLine={false}
					tickLine={false}
				/>

				{showThresholdLine && thresholdY && (
					<ReferenceLine
						y={thresholdY}
						stroke='rgba(255,100,100,0.6)'
						strokeDasharray='4 4'
						strokeWidth={1}
					/>
				)}

				<Tooltip
					contentStyle={CHART_TOOLTIP_STYLE}
					itemStyle={{ color: 'rgba(255,255,255,0.85)', fontFamily: FONT_FAMILY, fontSize: 13 }}
					labelStyle={{
						color: 'rgba(255,255,255,0.5)',
						fontFamily: FONT_FAMILY,
						fontSize: 11,
						fontWeight: 500,
					}}
					cursor={{ stroke: 'rgba(255,255,255,0.15)', strokeWidth: 1 }}
				/>

				<Area
					type='monotone'
					dataKey='value'
					stroke='rgba(255,255,255,0.85)'
					fill='url(#colorArea)'
					fillOpacity={1}
					strokeWidth={1.5}
					isAnimationActive
				/>
			</RAreaChart>
		</ResponsiveContainer>
	);
}

export default AreaChart;
