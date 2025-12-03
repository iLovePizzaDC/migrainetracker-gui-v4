import { useEffect, useState } from "react";
import { useUser } from "../../../../shared/hooks/user/use-user";
import type { ChartData } from "../../types/card/chart";
import { type TimeFrameUnit } from "../../../../shared/constants/cards/time-frame";
import { fetchAreaData, fetchPieData } from "../../utils/card/fetch-helper";
import { mapAreaResponse } from "../../utils/card/map-chart-response";
import { CARD_TYPES, type CardType } from "../../constants/card/card";
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
    const [currentPieValue, setCurrentPieValue] = useState(0);
    const [totalPieValue, setTotalPieValue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const collectChartData = async () => {
            setIsLoading(true);

            const { startDate, endDate, totalDays } = getDateRange(timeframeCount, timeframeUnit);

            if (chartType === CHART_TYPES.AREA && user) {
                const response = await fetchAreaData(cardType, endDate, timeframeCount, timeframeUnit, user.id);
                setAreaData(mapAreaResponse(response));
                setIsLoading(false);
                return;
            }

            if (chartType === CHART_TYPES.PIE && user) {
                const { data, value } = await fetchPieData(cardType, startDate, endDate, totalDays, user.id);
                setPieData(data);
                setCurrentPieValue(value);
                setTotalPieValue(cardType === CARD_TYPES.DURATION ? (totalDays * 24) : totalDays);
                setIsLoading(false);
                return;
            }
        };

        collectChartData();
    }, [cardType, chartType, timeframeCount, timeframeUnit, user]);

    return {
        isLoading,
        areaData,
        pieData,
        currentPieValue,
        totalPieValue,
    };
}
