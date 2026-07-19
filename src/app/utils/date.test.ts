import { getSeasonBackground } from '@/app/utils/date';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/bg-autumn.webp', () => ({ default: 'autumn.webp' }));
vi.mock('@/assets/bg-spring.webp', () => ({ default: 'spring.webp' }));
vi.mock('@/assets/bg-summer.webp', () => ({ default: 'summer.webp' }));
vi.mock('@/assets/bg-winter.webp', () => ({ default: 'winter.webp' }));

describe('getSeasonBackground', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it.each([
    [2, 'spring.webp'],
    [4, 'spring.webp'],
    [5, 'summer.webp'],
    [7, 'summer.webp'],
    [8, 'autumn.webp'],
    [10, 'autumn.webp'],
    [11, 'winter.webp'],
    [0, 'winter.webp'],
    [1, 'winter.webp'],
  ])('Monat %i → %s', (month, expected) => {
    vi.setSystemTime(new Date(2024, month, 15));

    expect(getSeasonBackground()).toBe(expected);
  });
});
