import { getSeasonBackground } from '@/app/utils/date';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/bg-autumn.jpg', () => ({ default: 'autumn.jpg' }));
vi.mock('@/assets/bg-spring.jpg', () => ({ default: 'spring.jpg' }));
vi.mock('@/assets/bg-summer.jpg', () => ({ default: 'summer.jpg' }));
vi.mock('@/assets/bg-winter.jpg', () => ({ default: 'winter.jpg' }));

describe('getSeasonBackground', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it.each([
		[2, 'spring.jpg'],
		[4, 'spring.jpg'],
		[5, 'summer.jpg'],
		[7, 'summer.jpg'],
		[8, 'autumn.jpg'],
		[10, 'autumn.jpg'],
		[11, 'winter.jpg'],
		[0, 'winter.jpg'],
		[1, 'winter.jpg'],
	])('Monat %i → %s', (month, expected) => {
		vi.setSystemTime(new Date(2024, month, 15));

		expect(getSeasonBackground()).toBe(expected);
	});
});
