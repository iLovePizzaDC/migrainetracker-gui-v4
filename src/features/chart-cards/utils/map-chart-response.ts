import type { RawAreaChartResponse } from '@/shared/api/types/event';
import type { ChartData } from '@/shared/types/chart';

export function mapAreaResponse(response: RawAreaChartResponse): ChartData {
	return response.labels.map((label: string, index: number) => ({
		name: label,
		value: response.dataPoints[index],
	}));
}
