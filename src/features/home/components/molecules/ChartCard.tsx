import { CHART_TYPES, type ChartType } from "../../constants/chart";
import AreaChart from "../atoms/AreaChart";
import PieChart from "../atoms/PieChart";

interface IChartCard {
    title: string;
    chartType: ChartType;
}

const area_data = [
    { name: "Mo", value: 12 },
    { name: "Di", value: 18 },
    { name: "Mi", value: 5 },
    { name: "Do", value: 27 },
    { name: "Fr", value: 19 },
    { name: "Sa", value: 33 },
    { name: "So", value: 14 },
];

const pie_data = [
    { name: "Migräne", value: 60 },
    { name: "Spannungskopfschmerz", value: 25 },
    { name: "Cluster", value: 15 },
];

function ChartCard({ title, chartType }: IChartCard) {

    return (
        <div className="
                rounded-2xl p-6
                bg-white/10 backdrop-blur-md
                border border-white/20
                shadow-lg shadow-black/20
                transition hover:shadow-xl
            "
        tabIndex={-1}
        >
            <h2 className="text-lg font-semibold mb-4">{title}</h2>

            <div className="h-72">
                {chartType === CHART_TYPES.AREA && <AreaChart data={area_data} />}
                {chartType === CHART_TYPES.PIE && <PieChart data={pie_data} />}
            </div>
        </div>
    );
}

export default ChartCard;
