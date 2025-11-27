import { CHART_TYPES } from "../../constants/chart";
import ChartCard from "../molecules/ChartCard";

function CardSection() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title="Migraine" chartType={CHART_TYPES.AREA} />
            <ChartCard title="Duration" chartType={CHART_TYPES.PIE} />
            <ChartCard title="Migraine" chartType={CHART_TYPES.AREA} />
            <ChartCard title="Duration" chartType={CHART_TYPES.PIE} />
        </div>
    );
}

export default CardSection;
