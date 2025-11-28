import { useState } from "react";
import { TIME_FRAME_UNITS } from "../../../../../shared/constants/cards/time-frame";
import { CARD_TYPES } from "../../../constants/card/card";
import { CHART_TYPES } from "../../../constants/card/chart";
import type { CardSetup } from "../../../types/card/chart";
import AppendCard from "../../molecules/card/AppendCard";
import ChartCard from "../../molecules/card/ChartCard";

const tmp_cards: CardSetup[] = [
    {
        index: 0,
        title: 'abc',
        cardType: CARD_TYPES.MIGRAINE,
        chartType: CHART_TYPES.AREA,
        timeframe: {
            count: 12,
            unit: TIME_FRAME_UNITS.MONTHS,
        },
    },
    {
        index: 1,
        title: 'defg',
        cardType: CARD_TYPES.MIGRAINE,
        chartType: CHART_TYPES.PIE,
        timeframe: {
            count: 16,
            unit: TIME_FRAME_UNITS.DAYS,
        },
    },
];

function CardSection() {
    const [cardSetups, setCardSetups] = useState<CardSetup[]>(tmp_cards);

    const appendCardSetup = (setup: CardSetup) => {
        setCardSetups((prev) => [
            ...prev,
            setup,
        ]);
    }; // TODO save and load from localstorage key is MT_CS

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

            <AppendCard
                nextIndex={cardSetups.length}
                appendCardSetup={appendCardSetup}
            />
        </div>
    );
}

export default CardSection;
