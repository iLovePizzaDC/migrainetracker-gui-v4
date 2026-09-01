import CardShell from '@/features/chart-cards/components/atoms/card/CardShell';
import OverviewCardHeader from '@/features/chart-cards/components/atoms/card/OverviewCardHeader';
import PieChart from '@/features/chart-cards/components/atoms/card/PieChart';
import { fetchMidasPieData } from '@/features/chart-cards/utils/fetch-helper';
import Skeleton from '@/shared/components/atoms/Skeleton';
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
			<OverviewCardHeader
				title='MIDAS Score'
				align='left'
				trailing={
					<span className={`card-badge ${color}`}>{label}</span>
				}
			/>
			<div className='chart-area'>
				{isLoading ? (
					<Skeleton className='h-full w-full' />
				) : (
					<PieChart outerData={pieData.current} innerData={pieData.previous} />
				)}
			</div>
			<div className='overview-card-footer'>
				{isLoading ? (
					<Skeleton className='mx-auto h-5 w-20 sm:h-6' />
				) : (
					<p className='card-footer-text'>{midasScore}/270</p>
				)}
			</div>
		</CardShell>
	);
}
export default MidasCard;
