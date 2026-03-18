import type { ChartData } from '@/features/home/types/chart';
import { fetchAreaData, fetchPieData } from '@/features/home/utils/fetch-helper';
import { getDateRange } from '@/features/home/utils/get-date-range';
import { mapAreaResponse } from '@/features/home/utils/map-chart-response';
import { fetchUserMedicinesGet } from '@/shared/api/medicine.api';
import { CARD_TYPES, CHART_TYPES } from '@/shared/constants/event/card';
import { useUser } from '@/shared/hooks/user/use-user';
import type { CardType, ChartType, TimeFrameUnit } from '@/shared/types/cards/card';
import type { EventFilter } from '@/shared/types/event/event';
import { useEffect, useState } from 'react';

export function useChartData(
	cardType: CardType,
	chartType: ChartType,
	filter: EventFilter,
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
			if (!user) return;

			setIsLoading(true);

			const { startDate, endDate, totalDays } = getDateRange(timeframeCount, timeframeUnit);
			const userMedicine = await fetchUserMedicinesGet();

			if (chartType === CHART_TYPES.AREA) {
				const response = await fetchAreaData(
					cardType,
					endDate,
					timeframeCount,
					timeframeUnit,
					filter,
					userMedicine,
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
					userMedicine,
				);
				setPieData(data);
				setCurrentPieValue(value);
				setTotalPieValue(cardType === CARD_TYPES.DURATION ? totalDays * 24 : totalDays);
				setIsLoading(false);
				return;
			}
		};

		collectChartData();
	}, [cardType, chartType, timeframeCount, timeframeUnit, user, filter]);

	return {
		isLoading,
		areaData,
		pieData,
		currentPieValue,
		totalPieValue,
	};
}
