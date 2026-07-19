import { SETUP_STORAGE_KEY } from '@/features/home/constants/setups';
import { CardSetupsContext } from '@/features/home/context/card-setups-context';
import { CardSetupsProvider } from '@/features/home/hooks/card-setups-provider';
import type { CardSetup } from '@/features/home/types/chart';
import { CARD_TYPES, CHART_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/event/card';
import { act, renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockSetup = (index: number, overrides: Partial<CardSetup> = {}): CardSetup => ({
  index,
  title: 'Test Setup',
  cardType: CARD_TYPES.MIGRAINE,
  chartType: CHART_TYPES.AREA,
  filter: { intensity: null, symptom: [], medicine: [], effectiveness: null, midas: [] },
  timeframe: { count: 2, unit: TIME_FRAME_UNITS.MONTHS },
  ...overrides,
});

function renderProvider() {
  const { result } = renderHook(() => useContext(CardSetupsContext), {
    wrapper: ({ children }) => <CardSetupsProvider>{children}</CardSetupsProvider>,
  });
  return result as { current: NonNullable<typeof result.current> };
}

describe('CardSetupsProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('initializes with empty array when localStorage is empty', () => {
      const result = renderProvider();

      expect(result.current.cardSetups).toEqual([]);
    });

    it('initializes from localStorage when saved data exists', () => {
      const saved = [mockSetup(0), mockSetup(1)];
      localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(saved));

      const result = renderProvider();

      expect(result.current.cardSetups).toEqual(saved);
    });

    it('falls back to empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem(SETUP_STORAGE_KEY, 'invalid json {');

      const result = renderProvider();

      expect(result.current.cardSetups).toEqual([]);
    });
  });

  describe('localStorage sync', () => {
    it('persists cardSetups to localStorage when state changes', () => {
      const result = renderProvider();

      act(() => {
        result.current.appendSetup(mockSetup(0));
      });

      const stored = JSON.parse(localStorage.getItem(SETUP_STORAGE_KEY)!);
      expect(stored).toHaveLength(1);
    });
  });

  describe('appenSetup', () => {
    it('appends a setup and normalizes indexes', () => {
      const result = renderProvider();

      act(() => {
        result.current.appendSetup(mockSetup(99));
      });
      act(() => {
        result.current.appendSetup(mockSetup(99));
      });

      expect(result.current.cardSetups).toHaveLength(2);
      expect(result.current.cardSetups[0].index).toBe(0);
      expect(result.current.cardSetups[1].index).toBe(1);
    });
  });

  describe('removeSetupByIndex', () => {
    it('removes setup by index', () => {
      const result = renderProvider();

      act(() => {
        result.current.appendSetup(mockSetup(0));
      });
      act(() => {
        result.current.appendSetup(mockSetup(1));
      });
      act(() => {
        result.current.removeSetupByIndex(0);
      });

      expect(result.current.cardSetups).toHaveLength(1);
    });

    it('re-normalizes indexes after removal', () => {
      const result = renderProvider();

      act(() => {
        result.current.appendSetup(mockSetup(0));
      });
      act(() => {
        result.current.appendSetup(mockSetup(1));
      });
      act(() => {
        result.current.appendSetup(mockSetup(2));
      });
      act(() => {
        result.current.removeSetupByIndex(1);
      });

      expect(result.current.cardSetups[0].index).toBe(0);
      expect(result.current.cardSetups[1].index).toBe(1);
    });

    it('does nothing when removing a non-existent index', () => {
      const result = renderProvider();

      act(() => {
        result.current.appendSetup(mockSetup(0));
      });
      act(() => {
        result.current.removeSetupByIndex(99);
      });

      expect(result.current.cardSetups).toHaveLength(1);
    });
  });

  describe('updateSetupByIndex', () => {
    it('updates a setup by index', () => {
      const result = renderProvider();

      act(() => {
        result.current.appendSetup(mockSetup(0));
      });
      act(() => {
        result.current.updateSetupByIndex({ ...mockSetup(0), someField: 'updated' } as any);
      });

      expect((result.current.cardSetups[0] as any).someField).toBe('updated');
    });

    it('does not affect other setups when updating', () => {
      const result = renderProvider();

      act(() => {
        result.current.appendSetup(mockSetup(0));
      });
      act(() => {
        result.current.appendSetup(mockSetup(1));
      });
      act(() => {
        result.current.updateSetupByIndex(mockSetup(0));
      });

      expect(result.current.cardSetups).toHaveLength(2);
      expect(result.current.cardSetups[1].index).toBe(1);
    });

    it('re-normalizes indexes after update', () => {
      const result = renderProvider();

      act(() => {
        result.current.appendSetup(mockSetup(0));
      });
      act(() => {
        result.current.appendSetup(mockSetup(1));
      });
      act(() => {
        result.current.updateSetupByIndex({ ...mockSetup(0), index: 99 } as any);
      });

      expect(result.current.cardSetups[0].index).toBe(0);
      expect(result.current.cardSetups[1].index).toBe(1);
    });
  });
});
