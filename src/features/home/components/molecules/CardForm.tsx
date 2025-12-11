import Button from "@/features/home/components/atoms/card/Button";
import Input from "@/features/home/components/atoms/card/Input";
import { CARD_OPTIONS } from "@/features/home/constants/card";
import { CHART_OPTIONS } from "@/features/home/constants/chart";
import { TIME_FRAME_UNIT_OPTIONS } from "@/features/home/constants/time-frame";
import { useCardSetups } from "@/features/home/hooks/use-card-setups";
import type { CardSetup } from "@/features/home/types/chart";
import DropdownInput from "@/shared/components/atoms/DropdownInput";
import FilterForm from "@/shared/components/molecules/FilterForm";
import { CARD_TYPES, CHART_TYPES, TIME_FRAME_UNITS } from "@/shared/constants/event/card";
import { BUTTON_TYPES } from "@/shared/constants/input/button";
import { INPUT_TYPES } from "@/shared/constants/input/input";
import type { CardType, ChartType, TimeFrameUnit } from "@/shared/types/cards/card";
import type { EventFilter } from "@/shared/types/event/event";
import { useState } from "react";

interface ICardForm {
    onButtonClick: (setup: CardSetup) => void;
    defaultIndex?: number;
    defaultTitle?: string;
    defaultCardType?: CardType;
    defaultChartType?: ChartType;
    defaultFilter?: EventFilter;
    defaultCount?: number;
    defaultUnit?: TimeFrameUnit;
}

function CardForm({
    onButtonClick,
    defaultIndex,
    defaultTitle = '',
    defaultCardType = CARD_TYPES.MIGRAINE,
    defaultChartType = CHART_TYPES.AREA,
    defaultFilter = { intensity: null, symptom: [], medicine: [], midas: [] },
    defaultCount = 12,
    defaultUnit = TIME_FRAME_UNITS.MONTHS,
}: ICardForm) {
    const { cardSetups } = useCardSetups();

    const [title, setTitle] = useState(defaultTitle);
    const [cardType, setCardType] = useState<CardType>(defaultCardType);
    const [chartType, setChartType] = useState<ChartType>(defaultChartType);
    const [filter, setFilter] = useState<EventFilter>(defaultFilter);
    const [count, setCount] = useState(defaultCount);
    const [unit, setUnit] = useState<TimeFrameUnit>(defaultUnit);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const cardSetup: CardSetup = {
            index: defaultIndex ?? cardSetups.length,
            title,
            cardType,
            chartType,
            filter,
            timeframe: {
                count,
                unit,
            }
        };

        setTitle(defaultTitle);
        setCardType(defaultCardType);
        setChartType(defaultChartType);
        setFilter(defaultFilter);
        setCount(defaultCount);
        setUnit(defaultUnit);

        onButtonClick(cardSetup);
    };

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
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

            <FilterForm filter={filter} setFilter={setFilter} />

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
