import { type TimeFrameUnit } from "../../../../../shared/constants/cards/time-frame";
import { type CardType } from "../../../constants/card/card";
import { CHART_TYPES, type ChartType } from "../../../constants/card/chart";
import { useChartData } from "../../../hooks/card/use-chart-data";
import AreaChart from "../../atoms/card/AreaChart";
import PieChart from "../../atoms/card/PieChart";

interface IChartCard {
    title: string;
    cardType: CardType;
    chartType: ChartType;
    timeframeCount: number;
    timeframeUnit: TimeFrameUnit;
}

function ChartCard({ title, cardType, chartType, timeframeCount, timeframeUnit }: IChartCard) {
    const { areaData, pieData } = useChartData(cardType, chartType, timeframeCount, timeframeUnit);

    return (
        <div className="
                self-start rounded-2xl p-6
                bg-transparent backdrop-blur-md
                border border-white/20
                shadow-lg shadow-black/20
                transition hover:shadow-xl
            "
        tabIndex={-1}
        >
            <h2 className="text-lg font-semibold mb-4">{title}</h2>

            <div className="h-72">
                {chartType === CHART_TYPES.AREA && <AreaChart data={areaData} />}
                {chartType === CHART_TYPES.PIE && <PieChart data={pieData} />}
            </div>
        </div>
    );
}

export default ChartCard;
