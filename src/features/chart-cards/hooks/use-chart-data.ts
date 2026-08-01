import { fetchAreaData, fetchPieData } from '@/features/chart-cards/utils/fetch-helper';
import { getDateRange } from '@/features/chart-cards/utils/get-date-range';
import { mapAreaResponse } from '@/features/chart-cards/utils/map-chart-response';
import { CARD_TYPES } from '@/shared/constants/chart-cards/cards';
import { CHART_TYPES } from '@/shared/constants/chart-cards/charts';
import { useUser } from '@/shared/hooks/use-user';
import type { CardType, TimeFrameUnit } from '@/shared/types/card';
import type { ChartData, ChartType } from '@/shared/types/chart';
import type { EventFilter } from '@/shared/types/event';
import { useEffect, useState } from 'react';

export function useChartData(
	cardType: CardType,
	chartType: ChartType,
	filter: EventFilter,
	timeframeCount: number,
	timeframeUnit: TimeFrameUnit,
) {
	const { user, medicines } = useUser();

	const [areaData, setAreaData] = useState<ChartData>([]);
	const [pieData, setPieData] = useState<ChartData>([]);
	const [currentPieValue, setCurrentPieValue] = useState(0);
	const [totalPieValue, setTotalPieValue] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const collectChartData = async () => {
			if (!user || !medicines) return;

			setIsLoading(true);

			const { startDate, endDate, totalDays } = getDateRange(timeframeCount, timeframeUnit);

			if (chartType === CHART_TYPES.AREA) {
				const response = await fetchAreaData(
					cardType,
					endDate,
					timeframeCount,
					timeframeUnit,
					filter,
					medicines,
				);
				setAreaData(mapAreaResponse(response));
				setIsLoading(false);
				return;
			}

			if (chartType === CHART_TYPES.PIE) {
				const { data, value } = await fetchPieData(
					cardType,
					startDate,
					endDate,
					totalDays,
					filter,
					medicines,
				);
				setPieData(data);
				setCurrentPieValue(value);
				setTotalPieValue(cardType === CARD_TYPES.DURATION ? totalDays * 24 : totalDays);
				setIsLoading(false);
				return;
			}
		};

		collectChartData();
	}, [cardType, chartType, timeframeCount, timeframeUnit, user, filter, medicines]);

	return {
		isLoading,
		areaData,
		pieData,
		currentPieValue,
		totalPieValue,
	};
}
