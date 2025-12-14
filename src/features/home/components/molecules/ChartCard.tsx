import AreaChart from "@/features/home/components/atoms/card/AreaChart";
import PieChart from "@/features/home/components/atoms/card/PieChart";
import ContextMenu from "@/features/home/components/atoms/context-menu/ContextMenu";
import CardForm from "@/features/home/components/molecules/CardForm";
import { useCardSetups } from "@/features/home/hooks/use-card-setups";
import { useChartData } from "@/features/home/hooks/use-chart-data";
import type { CardSetup } from "@/features/home/types/chart";
import { CARD_TYPES, CHART_TYPES } from "@/shared/constants/event/card";
import type { CardType, ChartType, TimeFrameUnit } from "@/shared/types/cards/card";
import type { EventFilter } from "@/shared/types/event/event";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface IChartCard {
    index: number;
    title: string;
    cardType: CardType;
    chartType: ChartType;
    filter: EventFilter;
    timeframeCount: number;
    timeframeUnit: TimeFrameUnit;
}

function ChartCard({ index, title, cardType, chartType, filter, timeframeCount, timeframeUnit }: IChartCard) {
    const { removeSetupByIndex, updateSetupByIndex } = useCardSetups();
    const { isLoading, areaData, pieData, currentPieValue, totalPieValue } = useChartData(cardType, chartType, filter, timeframeCount, timeframeUnit);

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

            <div
                className={`
                    grid overflow-hidden
                    transition-[grid-template-rows] duration-300 ease-out
                    ${isEditing ? "grid-rows-[0fr_1fr]" : "grid-rows-[1fr_0fr]"}
                `}
            >
                <div className="overflow-hidden transition-all duration-300">
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
                </div>
                <div
                    className={`
                        overflow-hidden
                        transition-[opacity,max-height] duration-300 ease-out
                        ${isEditing
                            ? "opacity-100 max-h-[1000px] visible pointer-events-auto"
                            : "opacity-0 max-h-0 invisible pointer-events-none"
                        }
                    `}
                >
                    <CardForm
                        onButtonClick={onEdit}
                        defaultIndex={index}
                        defaultTitle={title}
                        defaultCardType={cardType}
                        defaultChartType={chartType}
                        defaultFilter={filter}
                        defaultCount={timeframeCount}
                        defaultUnit={timeframeUnit}
                        />
                </div>
            </div>
        </div>
    );
}

export default ChartCard;
