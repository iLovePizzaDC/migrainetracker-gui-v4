import { useMedDays } from '@/features/calendar/hooks/use-med-days';
import * as api from '@/shared/api/migraine.api';
import { MEDICINE_TYPES } from '@/shared/constants/user/medicine';
import * as dateUtils from '@/shared/utils/date/date';
import * as fetchHelper from '@/shared/utils/fetch-helper';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fakeDate = new Date('2026-01-01');

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

vi.mock('@/shared/hooks/user/use-user', () => ({
  useUser: () => ({
    medicines: mockUserMedicines,
  }),
}));

describe('useMedDays', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(fetchHelper, 'getMohMedicineFilter').mockResolvedValue('med1,med2');
    vi.spyOn(api, 'fetchMigraineAmount').mockResolvedValue(5);
    vi.spyOn(dateUtils, 'formatDateToUs').mockImplementation((d) => d.toISOString().split('T')[0]);
    vi.spyOn(dateUtils, 'getStartOfMonth').mockReturnValue(fakeDate);
    vi.spyOn(dateUtils, 'getEndOfMonth').mockReturnValue(fakeDate);
  });

  it('initial state is correct', () => {
    vi.spyOn(fetchHelper, 'getMohMedicineFilter').mockReturnValue(new Promise(() => { }));

    const { result } = renderHook(() => useMedDays(fakeDate));

    expect(result.current.medDaysCount).toBe(0);
    expect(result.current.maxMedDaysCount).toBe(10);
  });

  it('loads med days on mount', async () => {
    const { result } = renderHook(() => useMedDays(fakeDate));

    await waitFor(() => expect(result.current.medDaysCount).toBe(5));

    expect(api.fetchMigraineAmount).toHaveBeenCalledWith('2026-01-01', '2026-01-01', {
      medicines: 'med1,med2',
    });
  });

  it('collectMedDays can be called manually', async () => {
    vi.spyOn(fetchHelper, 'getMohMedicineFilter').mockResolvedValue('med1');
    vi.spyOn(api, 'fetchMigraineAmount').mockResolvedValue(7);

    const { result } = renderHook(() => useMedDays(fakeDate));

    await act(async () => {
      await result.current.collectMedDays();
    });

    expect(result.current.medDaysCount).toBe(7);
    expect(api.fetchMigraineAmount).toHaveBeenCalled();
  });
});
