import { useChartData } from '@/features/home/hooks/use-chart-data';
import * as fetchHelper from '@/features/home/utils/fetch-helper';
import * as getDateRangeUtil from '@/features/home/utils/get-date-range';
import * as mapChartResponse from '@/features/home/utils/map-chart-response';
import { CARD_TYPES, CHART_TYPES, TIME_FRAME_UNITS } from '@/shared/constants/event/card';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import * as useUserHook from '@/shared/hooks/user/use-user';
import type { CardType, ChartType, TimeFrameUnit } from '@/shared/types/cards/card';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/user/use-user', () => ({
  useUser: vi.fn(),
}));
vi.mock('@/shared/api/medicine.api');
vi.mock('@/features/home/utils/fetch-helper');
vi.mock('@/features/home/utils/get-date-range');
vi.mock('@/features/home/utils/map-chart-response');

const mockFilter = {
  intensity: null,
  symptom: [],
  medicine: [],
  effectiveness: null,
  midas: [],
};

const mockUser = { id: 'user-1', name: 'Test' };

const mockDateRange = {
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  totalDays: 31,
};

const mockMedLabel = 'test medicine';
const mockMedValue = 'tst_med';
const mockUserMedicines = [
  {
    name: `${mockMedLabel} 1`,
    abbreviation: `${mockMedValue}_1`,
    type: MEDICINE_TYPES.MIGRAINE_PAINKILLER,
  },
  {
    name: `${mockMedLabel} 2`,
    abbreviation: `${mockMedValue}_2`,
    type: MEDICINE_TYPES.PAINKILLER,
  },
];

function renderChartData(
  cardType: CardType = CARD_TYPES.MIGRAINE,
  chartType: ChartType = CHART_TYPES.AREA,
  overrides: Partial<{ filter: typeof mockFilter; count: number; unit: TimeFrameUnit }> = {},
) {
  return renderHook(() =>
    useChartData(
      cardType,
      chartType,
      overrides.filter ?? mockFilter,
      overrides.count ?? 30,
      overrides.unit ?? TIME_FRAME_UNITS.DAYS,
    ),
  );
}

describe('useChartData', () => {
  beforeEach(() => {
    vi.mocked(useUserHook.useUser).mockReturnValue({
      user: mockUser,
      medicines: mockUserMedicines,
    } as any);

    vi.mocked(getDateRangeUtil.getDateRange).mockReturnValue(mockDateRange as any);
    vi.mocked(fetchHelper.fetchAreaData).mockResolvedValue([] as any);
    vi.mocked(fetchHelper.fetchPieData).mockResolvedValue({ data: [], value: 0 } as any);
    vi.mocked(mapChartResponse.mapAreaResponse).mockReturnValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with isLoading: true and empty data', () => {
      vi.mocked(fetchHelper.fetchAreaData).mockReturnValue(new Promise(() => { }));

      const { result } = renderChartData();

      expect(result.current.isLoading).toBe(true);
      expect(result.current.areaData).toEqual([]);
      expect(result.current.pieData).toEqual([]);
      expect(result.current.currentPieValue).toBe(0);
      expect(result.current.totalPieValue).toBe(0);
    });

    it('does not fetch when user is null', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({ user: null } as any);

      renderChartData();

      expect(fetchHelper.fetchAreaData).not.toHaveBeenCalled();
    });

    it('does not fetch when medicines is null', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({ medicines: null } as any);

      renderChartData();

      expect(fetchHelper.fetchAreaData).not.toHaveBeenCalled();
    });
  });

  describe('area chart', () => {
    it('fetches area data when chartType is AREA', async () => {
      const fakeAreaData = [{ name: 'Jan', value: 5 }];
      vi.mocked(mapChartResponse.mapAreaResponse).mockReturnValue(fakeAreaData);

      const { result } = renderChartData(CARD_TYPES.MIGRAINE, CHART_TYPES.AREA);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(fetchHelper.fetchAreaData).toHaveBeenCalledWith(
        CARD_TYPES.MIGRAINE,
        mockDateRange.endDate,
        30,
        TIME_FRAME_UNITS.DAYS,
        mockFilter,
        mockUserMedicines,
      );
      expect(result.current.areaData).toEqual(fakeAreaData);
    });

    it('sets areaData from mapAreaResponse', async () => {
      const mapped = [{ name: 'Feb', value: 3 }];
      vi.mocked(mapChartResponse.mapAreaResponse).mockReturnValue(mapped);

      const { result } = renderChartData(CARD_TYPES.MIGRAINE, CHART_TYPES.AREA);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.areaData).toEqual(mapped);
    });

    it('does not call fetchPieData when chartType is AREA', async () => {
      const { result } = renderChartData(CARD_TYPES.MIGRAINE, CHART_TYPES.AREA);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(fetchHelper.fetchPieData).not.toHaveBeenCalled();
    });
  });

  describe('pie chart', () => {
    it('fetches pie data when chartType is PIE', async () => {
      const fakePieData = [{ name: 'A', value: 10 }];
      vi.mocked(fetchHelper.fetchPieData).mockResolvedValue({ data: fakePieData, value: 7 } as any);

      const { result } = renderChartData(CARD_TYPES.MIGRAINE, CHART_TYPES.PIE);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(fetchHelper.fetchPieData).toHaveBeenCalledWith(
        CARD_TYPES.MIGRAINE,
        mockDateRange.startDate,
        mockDateRange.endDate,
        mockDateRange.totalDays,
        mockFilter,
        mockUserMedicines,
      );
      expect(result.current.pieData).toEqual(fakePieData);
      expect(result.current.currentPieValue).toBe(7);
    });

    it('sets totalPieValue to totalDays * 24 for DURATION card type', async () => {
      vi.mocked(fetchHelper.fetchPieData).mockResolvedValue({ data: [], value: 0 } as any);

      const { result } = renderChartData(CARD_TYPES.DURATION, CHART_TYPES.PIE);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.totalPieValue).toBe(mockDateRange.totalDays * 24);
    });

    it('sets totalPieValue to totalDays for non-DURATION card type', async () => {
      vi.mocked(fetchHelper.fetchPieData).mockResolvedValue({ data: [], value: 0 } as any);

      const { result } = renderChartData(CARD_TYPES.MIGRAINE, CHART_TYPES.PIE);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.totalPieValue).toBe(mockDateRange.totalDays);
    });

    it('does not call fetchAreaData when chartType is PIE', async () => {
      const { result } = renderChartData(CARD_TYPES.MIGRAINE, CHART_TYPES.PIE);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(fetchHelper.fetchAreaData).not.toHaveBeenCalled();
    });
  });

  describe('isLoading', () => {
    it('sets isLoading: false after area fetch completes', async () => {
      const { result } = renderChartData(CARD_TYPES.MIGRAINE, CHART_TYPES.AREA);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('sets isLoading: false after pie fetch completes', async () => {
      const { result } = renderChartData(CARD_TYPES.MIGRAINE, CHART_TYPES.PIE);

      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });
  });
});
