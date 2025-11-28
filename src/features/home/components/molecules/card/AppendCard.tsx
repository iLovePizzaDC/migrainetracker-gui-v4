import { useState } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import Input from "../../atoms/card/Input";
import { INPUT_TYPES } from "../../../../../shared/constants/input/input";
import { BUTTON_TYPES } from "../../../../../shared/constants/input/button";
import type { CardSetup } from "../../../types/card/chart";
import { CHART_OPTIONS, CHART_TYPES, type ChartType } from "../../../constants/card/chart";
import { TIME_FRAME_UNIT_OPTIONS, TIME_FRAME_UNITS, type TimeFrameUnit } from "../../../../../shared/constants/cards/time-frame";
import { CARD_OPTIONS, CARD_TYPES, type CardType } from "../../../constants/card/card";
import Button from "../../atoms/card/Button";
import DropdownInput from "../../atoms/card/DropdownInput";

interface IAppendCard {
    nextIndex: number;
    appendCardSetup: (setup: CardSetup) => void;
}

function AppendCard({ nextIndex, appendCardSetup }: IAppendCard) {
    const [expanded, setExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [cardType, setCardType] = useState<CardType>(CARD_TYPES.MIGRAINE);
    const [chartType, setChartType] = useState<ChartType>(CHART_TYPES.AREA);
    const [count, setCount] = useState(12);
    const [unit, setUnit] = useState<TimeFrameUnit>(TIME_FRAME_UNITS.MONTHS);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        appendCardSetup({
            index: nextIndex,
            title,
            cardType,
            chartType,
            timeframe: {
                count,
                unit
            }
        });
    };

    return (
        <div
            className="
                self-start rounded-2xl
                bg-transparent backdrop-blur-md
                border border-white/20
                shadow-lg shadow-black/20
                transition hover:shadow-xl
            "
            tabIndex={-1}
        >
            <div
                className="p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <h2 className="text-lg font-semibold">Add more</h2>
                {expanded ? (
                    <MinusIcon className="w-6 h-6" />
                ) : (
                    <PlusIcon className="w-6 h-6" />
                )}
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'h-96' : 'h-0'}`}>
                {expanded && (
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
                            title="Add"
                        />
                    </form>
                )}
            </div>
        </div>
    );
}

export default AppendCard;
