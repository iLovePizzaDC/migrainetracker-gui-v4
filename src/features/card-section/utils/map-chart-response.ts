import type { RawAreaChartResponse } from '@/shared/api/types/event';

export function mapAreaResponse(response: RawAreaChartResponse) {
	return response.labels.map((label: string, index: number) => ({
		name: label,
		value: response.dataPoints[index],
	}));
}
