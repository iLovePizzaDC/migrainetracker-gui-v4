import { useEffect, useState } from "react";
import { useUser } from "../../../../shared/hooks/user/use-user";
import type { ChartData } from "../../types/card/chart";
import { type TimeFrameUnit } from "../../../../shared/constants/cards/time-frame";
import { fetchAreaData, fetchPieData } from "../../utils/card/fetch-helper";
import { mapAreaResponse } from "../../utils/card/map-chart-response";
import type { CardType } from "../../constants/card/card";
import { type ChartType, CHART_TYPES } from "../../constants/card/chart";
import { getDateRange } from "../../utils/card/get-date-range";

export function useChartData(
    cardType: CardType,
    chartType: ChartType,
    timeframeCount: number,
    timeframeUnit: TimeFrameUnit,
) {
    const { user } = useUser();

    const [areaData, setAreaData] = useState<ChartData>([]);
    const [pieData, setPieData] = useState<ChartData>([]);

    useEffect(() => {
        const collectChartData = async () => {
            const { startDate, endDate, totalDays } = getDateRange(timeframeCount, timeframeUnit);

            if (chartType === CHART_TYPES.AREA && user) {
                const response = await fetchAreaData(cardType, endDate, timeframeCount, timeframeUnit, user.id);
                setAreaData(mapAreaResponse(response));
                return;
            }

            if (chartType === CHART_TYPES.PIE && user) {
                const pie = await fetchPieData(cardType, startDate, endDate, totalDays, user.id);
                setPieData(pie);
                return;
            }
        };

        collectChartData();
    }, [cardType, chartType, timeframeCount, timeframeUnit, user]);

    return {
        areaData,
        pieData,
    };
}
