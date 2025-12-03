import AppendCard from "../../molecules/card/AppendCard";
import ChartCard from "../../molecules/card/ChartCard";
import MidasCard from "../../molecules/card/MidasCard";
import { useCardSetups } from "../../../hooks/card/use-card-setups";

function CardSection() {
    const { cardSetups } = useCardSetups();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
            {cardSetups.sort((a, b) => a.index - b.index).map(cardSetup => (
                <ChartCard
                    key={cardSetup.index}
                    index={cardSetup.index}
                    title={cardSetup.title}
                    cardType={cardSetup.cardType}
                    chartType={cardSetup.chartType}
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
