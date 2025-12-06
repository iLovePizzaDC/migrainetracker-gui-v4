import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useChartData } from "../../../hooks/card/use-chart-data";
import AreaChart from "../../atoms/card/AreaChart";
import PieChart from "../../atoms/card/PieChart";
import { useState } from "react";
import { CHART_TYPES, type ChartType } from "../../../constants/card/chart";
import { type TimeFrameUnit } from "../../../../../shared/constants/cards/time-frame";
import { CARD_TYPES, type CardType } from "../../../constants/card/card";
import ContextMenu from "../../atoms/context-menu/ContextMenu";
import CardForm from "./CardForm";
import { useCardSetups } from "../../../hooks/card/use-card-setups";
import type { CardSetup } from "../../../types/card/chart";

interface IChartCard {
    index: number;
    title: string;
    cardType: CardType;
    chartType: ChartType;
    timeframeCount: number;
    timeframeUnit: TimeFrameUnit;
}

function ChartCard({ index, title, cardType, chartType, timeframeCount, timeframeUnit }: IChartCard) {
    const { removeSetupByIndex, updateSetupByIndex } = useCardSetups();
    const { isLoading, areaData, pieData, currentPieValue, totalPieValue } = useChartData(cardType, chartType, timeframeCount, timeframeUnit);

    const [contextOpen, setContextOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const onEdit = (setup: CardSetup) => {
        updateSetupByIndex(setup);
        setIsEditing(false);
    };

    const onRemove = () => {
        removeSetupByIndex(index);
    };

    return (
        <div
            className="
                w-full self-start
                rounded-2xl p-6 relative
                bg-transparent backdrop-blur-md
                border border-white/20
                shadow-lg shadow-black/20
                transition hover:shadow-xl
            "
        >
            <div className="flex items-center w-full mb-2 relative">
                <div className="w-7 h-7 p-1 opacity-0 pointer-events-none" />

                <h2 className="flex-1 text-lg font-semibold text-center">{title}</h2>

                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        setContextOpen((v) => !v);
                    }}
                    className="hover:opacity-80 transition-opacity p-1"
                >
                    <EllipsisVerticalIcon className="h-7 w-7" />
                </button>

                <ContextMenu
                    open={contextOpen}
                    setOpen={setContextOpen}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onRemoveClick={onRemove}
                />
            </div>

            {isEditing ? (
                <CardForm
                    onButtonClick={onEdit}
                    defaultIndex={index}
                    defaultTitle={title}
                    defaultCardType={cardType}
                    defaultChartType={chartType}
                    defaultCount={timeframeCount}
                    defaultUnit={timeframeUnit}
                />
            ) : (
                <>
                    <div className="h-72 w-full flex items-center justify-center">
                        {/* TODO set thresholdY danimcally based on mixed use (10) or without (15) */}
                        {/* TODO add average line to areachart? */}
                        {isLoading ? (
                            <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-xl animate-pulse" />
                        ) : chartType === CHART_TYPES.AREA ? (
                            <AreaChart data={areaData} showThresholdLine={cardType === CARD_TYPES.MOH} thresholdY={cardType === CARD_TYPES.MOH ? 10 : undefined} />
                        ) : (
                            <PieChart data={pieData} />
                        )}
                    </div>

                    {!isLoading && chartType === CHART_TYPES.PIE && totalPieValue > 0 && (
                        <div className="mt-2 text-center">
                            <p className="text-lg font-medium">
                                {currentPieValue.toLocaleString('en-US')}/{totalPieValue.toLocaleString('en-US')} {cardType === CARD_TYPES.DURATION ? 'hours' : 'days'}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ChartCard;
