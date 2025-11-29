import { useState } from "react";
import { TIME_FRAME_UNIT_OPTIONS, TIME_FRAME_UNITS, type TimeFrameUnit } from "../../../../../shared/constants/cards/time-frame";
import { BUTTON_TYPES } from "../../../../../shared/constants/input/button";
import { INPUT_TYPES } from "../../../../../shared/constants/input/input";
import { CARD_OPTIONS, CARD_TYPES, type CardType } from "../../../constants/card/card";
import { CHART_OPTIONS, CHART_TYPES, type ChartType } from "../../../constants/card/chart";
import Button from "../../atoms/card/Button";
import DropdownInput from "../../atoms/card/DropdownInput";
import Input from "../../atoms/card/Input";
import type { CardSetup } from "../../../types/card/chart";
import { useCardSetups } from "../../../hooks/card/use-card-setups";

interface ICardForm {
    onButtonClick: (setup: CardSetup) => void;
    defaultIndex?: number;
    defaultTitle?: string;
    defaultCardType?: CardType;
    defaultChartType?: ChartType;
    defaultCount?: number;
    defaultUnit?: TimeFrameUnit;
}

function CardForm({
    onButtonClick,
    defaultIndex,
    defaultTitle = '',
    defaultCardType = CARD_TYPES.MIGRAINE,
    defaultChartType = CHART_TYPES.AREA,
    defaultCount = 12,
    defaultUnit = TIME_FRAME_UNITS.MONTHS,
}: ICardForm) {
    const { cardSetups } = useCardSetups();

    const [title, setTitle] = useState(defaultTitle);
    const [cardType, setCardType] = useState<CardType>(defaultCardType);
    const [chartType, setChartType] = useState<ChartType>(defaultChartType);
    const [count, setCount] = useState(defaultCount);
    const [unit, setUnit] = useState<TimeFrameUnit>(defaultUnit);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const cardSetup: CardSetup = {
            index: defaultIndex ?? cardSetups.length,
            title,
            cardType,
            chartType,
            timeframe: {
                count,
                unit,
            }
        };

        setTitle(defaultTitle);
        setCardType(defaultCardType);
        setChartType(defaultChartType);
        setCount(defaultCount);
        setUnit(defaultUnit);

        onButtonClick(cardSetup);
    };

    return (
        <form className="px-6 pb-6 mt-4 space-y-4" onSubmit={onSubmit}>
            <Input
                id="appendTitle"
                label="Title"
                type={INPUT_TYPES.TEXT}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter a title"
                required
            />
            <DropdownInput
                id="appendCardType"
                label="Card Type"
                value={cardType}
                options={CARD_OPTIONS}
                onChange={(event) => setCardType(event.target.value as CardType)}
                required
            />

            <DropdownInput
                id="appendChartType"
                label="Chart Type"
                value={chartType}
                options={CHART_OPTIONS}
                onChange={(event) => setChartType(event.target.value as ChartType)}
                required
            />

            <div className="flex items-center space-x-2">
                <div className="flex-1 w-1/2">
                    <Input
                        id="appendValue"
                        label="Value"
                        type={INPUT_TYPES.NUMBER}
                        value={count.toString()}
                        onChange={(event) => setCount(Number(event.target.value))}
                        placeholder="Enter number"
                        required
                    />
                </div>

                <div className="w-1/2">
                    <DropdownInput
                        id="appendUnit"
                        label="Unit"
                        value={unit}
                        options={TIME_FRAME_UNIT_OPTIONS}
                        onChange={(event) => setUnit(event.target.value as TimeFrameUnit)}
                        required
                    />
                </div>
            </div>

            <Button
                type={BUTTON_TYPES.SUBMIT}
                title="Submit"
            />
        </form>
    );
}

export default CardForm;
