import type { ChartData } from '@/features/card-section/types/chart';
import { fetchAreaData, fetchPieData } from '@/features/card-section/utils/fetch-helper';
import { getDateRange } from '@/features/card-section/utils/get-date-range';
import { mapAreaResponse } from '@/features/card-section/utils/map-chart-response';
import { useUser } from '@/shared/hooks/use-user';
import type { EventFilter } from '@/shared/types/event';
import { useEffect, useState } from 'react';
import { CARD_TYPES, CHART_TYPES } from '../constants/card';
import type { CardType, ChartType, TimeFrameUnit } from '@/shared/types/cards';

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
