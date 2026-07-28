import ChartCard from '@/features/card-section/components/molecules/ChartCard';
import MidasCard from '@/features/card-section/components/molecules/MidasCard';
import { useCardSetups } from '@/features/card-section/hooks/use-card-setups';
import AppendCard from '@/features/card-section/components/molecules/AppendCard';

function CardSection() {
	const { cardSetups } = useCardSetups();

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center'>
			{cardSetups
				.sort((a, b) => a.index - b.index)
				.map((cardSetup) => (
					<ChartCard
						key={cardSetup.index}
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
