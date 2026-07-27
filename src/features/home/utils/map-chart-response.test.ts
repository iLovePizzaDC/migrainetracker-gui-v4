import { mapAreaResponse } from '@/features/home/utils/map-chart-response';
import { describe, expect, it } from 'vitest';

describe('mapAreaResponse', () => {
	it('maps labels and dataPoints into chart data', () => {
		const result = mapAreaResponse({
			labels: ['Jan', 'Feb', 'Mar'],
			dataPoints: [5, 3, 8],
		} as any);

		expect(result).toEqual([
			{ name: 'Jan', value: 5 },
			{ name: 'Feb', value: 3 },
			{ name: 'Mar', value: 8 },
		]);
	});

	it('returns empty array when labels and dataPoints are empty', () => {
		const result = mapAreaResponse({ labels: [], dataPoints: [] } as any);
		expect(result).toEqual([]);
	});

	it('uses the index to match label with correct dataPoint', () => {
		const result = mapAreaResponse({
			labels: ['A', 'B'],
			dataPoints: [10, 20],
		} as any);

		expect(result[0]).toEqual({ name: 'A', value: 10 });
		expect(result[1]).toEqual({ name: 'B', value: 20 });
	});

	it('returns undefined value when dataPoints has fewer entries than labels', () => {
		const result = mapAreaResponse({
			labels: ['A', 'B', 'C'],
			dataPoints: [1],
		} as any);

		expect(result[1].value).toBeUndefined();
		expect(result[2].value).toBeUndefined();
	});
});
