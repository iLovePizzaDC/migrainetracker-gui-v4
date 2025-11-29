import type { CardSetup } from "../../../types/card/chart";
import AppendCard from "../../molecules/card/AppendCard";
import ChartCard from "../../molecules/card/ChartCard";
import MidasCard from "../../molecules/card/MidasCard";
import { useCardSetups } from "../../../hooks/card/use-card-setups";

function CardSection() {
    const { cardSetups, setCardSetups } = useCardSetups();

    const appendCardSetup = (setup: CardSetup) => {
        setCardSetups((prev) => [
            ...prev,
            setup,
        ]);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cardSetups.sort((a, b) => a.index - b.index).map(cardSetup => (
                <ChartCard
                    key={cardSetup.index}
                    title={cardSetup.title}
                    cardType={cardSetup.cardType}
                    chartType={cardSetup.chartType}
                    timeframeCount={cardSetup.timeframe.count}
                    timeframeUnit={cardSetup.timeframe.unit}
                />
            ))}

            <MidasCard />

            <AppendCard
                nextIndex={cardSetups.length}
                appendCardSetup={appendCardSetup}
            />
        </div>
    );
}

export default CardSection;
