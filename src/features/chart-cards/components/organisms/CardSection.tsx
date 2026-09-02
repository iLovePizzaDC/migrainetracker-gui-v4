import AppendCard from '@/features/chart-cards/components/molecules/AppendCard';
import ChartCard from '@/features/chart-cards/components/molecules/ChartCard';
import MidasCard from '@/features/chart-cards/components/molecules/MidasCard';
import { useCardSetups } from '@/features/chart-cards/hooks/use-card-setups';

function CardSection() {
	const { cardSetups } = useCardSetups();

	return (
		<div className='grid min-w-0 grid-cols-1 justify-items-stretch gap-4 sm:gap-4 md:grid-cols-2 md:gap-5'>
			{cardSetups
				.sort((a, b) => a.index - b.index)
				.map((cardSetup) => (
					<ChartCard
						key={JSON.stringify(cardSetup)}
						index={cardSetup.index}
						title={cardSetup.title}
						cardType={cardSetup.cardType}
						chartType={cardSetup.chartType}
						filter={cardSetup.filter}
						timeframeCount={cardSetup.timeframe.count}
						timeframeUnit={cardSetup.timeframe.unit}
					/>
				))}

			<MidasCard />

			<AppendCard />
		</div>
	);
}

export default CardSection;
