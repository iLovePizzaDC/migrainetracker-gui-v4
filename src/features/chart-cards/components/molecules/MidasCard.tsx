import CardShell from '@/features/chart-cards/components/atoms/card/CardShell';
import PieChart from '@/features/chart-cards/components/atoms/card/PieChart';
import { fetchMidasPieData } from '@/features/chart-cards/utils/fetch-helper';
import { useUser } from '@/shared/hooks/use-user';
import type { ChartData } from '@/shared/types/chart';
import { useEffect, useState } from 'react';

function MidasCard() {
	const { user } = useUser();

	const [midasScore, setMidasScore] = useState<number>(0);
	const [pieData, setPieData] = useState<{ current: ChartData; previous: ChartData }>({
		current: [],
		previous: [],
	});
	const [isLoading, setIsLoading] = useState(true);

	const getColorIndicator = () => {
		if (midasScore >= 21) return { color: 'text-red-300/90', label: 'severe' };
		if (midasScore >= 11) return { color: 'text-orange-300/90', label: 'moderate' };
		if (midasScore >= 6) return { color: 'text-yellow-200/90', label: 'mild' };
		return { color: 'text-white/50', label: 'not/little' };
	};

	useEffect(() => {
		if (!user) return;

		const collectChartData = async () => {
			setIsLoading(true);
			const pie = await fetchMidasPieData();
			setMidasScore(pie.current.score);
			setPieData({
				current: pie.current.pieData,
				previous: pie.previous.pieData,
			});

			setIsLoading(false);
		};

		collectChartData();
	}, [user]);

	const { color, label } = getColorIndicator();

	if (midasScore === 0) return null;

	return (
		<CardShell>
			<div className='mb-4 flex min-w-0 items-center justify-between gap-2'>
				<h2 className='min-w-0 flex-1 truncate text-sm font-medium tracking-wide text-white/80'>
					MIDAS Score
				</h2>
				<span
					className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider ${color}`}
				>
					{label}
				</span>
			</div>
			<div className='chart-area'>
				{isLoading ? (
					<div className='h-full w-full animate-pulse rounded-xl bg-white/5' />
				) : (
					<PieChart outerData={pieData.current} innerData={pieData.previous} />
				)}
			</div>
			<div className='mt-1 h-6 text-center'>
				{isLoading ? (
					<div className='mx-auto h-6 w-20 animate-pulse rounded-md bg-white/5' />
				) : (
					<p className='text-sm font-medium tabular-nums text-white/70'>{midasScore}/270</p>
				)}
			</div>
		</CardShell>
	);
}
export default MidasCard;
