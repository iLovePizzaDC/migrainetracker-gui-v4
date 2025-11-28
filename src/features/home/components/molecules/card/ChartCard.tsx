import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useChartData } from "../../../hooks/card/use-chart-data";
import AreaChart from "../../atoms/card/AreaChart";
import PieChart from "../../atoms/card/PieChart";
import { useState } from "react";
import { CHART_TYPES, type ChartType } from "../../../constants/card/chart";
import { type TimeFrameUnit } from "../../../../../shared/constants/cards/time-frame";
import { type CardType } from "../../../constants/card/card";
import ContextMenu from "../../atoms/context-menu/ContextMenu";

interface IChartCard {
    title: string;
    cardType: CardType;
    chartType: ChartType;
    timeframeCount: number;
    timeframeUnit: TimeFrameUnit;
}

function ChartCard({ title, cardType, chartType, timeframeCount, timeframeUnit }: IChartCard) {
    const { areaData, pieData } = useChartData(cardType, chartType, timeframeCount, timeframeUnit);

    const [contextOpen, setContextOpen] = useState(false);

    return (
        <div
            className="
                self-start rounded-2xl p-6 relative
                bg-transparent backdrop-blur-md
                border border-white/20
                shadow-lg shadow-black/20
                transition hover:shadow-xl
            "
        >
            <div className="flex items-center w-full mb-4 relative">
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
                />
            </div>

            <div className="h-72">
                {chartType === CHART_TYPES.AREA && <AreaChart data={areaData} />}
                {chartType === CHART_TYPES.PIE && <PieChart data={pieData} />}
            </div>
        </div>
    );
}

export default ChartCard;
