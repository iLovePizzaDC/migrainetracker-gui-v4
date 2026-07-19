import { fetchMigraineAmount } from '@/shared/api/migraine.api';
import { useUser } from '@/shared/hooks/user/use-user';
import { formatDateToUs, getEndOfMonth, getStartOfMonth } from '@/shared/utils/date/date';
import { getMohMedicineFilter } from '@/shared/utils/fetch-helper';
import { useCallback, useEffect, useState } from 'react';

export function useMedDays(currentDate: Date) {
  const { medicines } = useUser();
  const [medDaysCount, setMedDaysCount] = useState(0);
  const [maxMedDaysCount] = useState(10); // TODO calculate dynamically (10 with mixed use, 15 without)

  const collectMedDays = useCallback(async () => {
    const start = formatDateToUs(getStartOfMonth(currentDate));
    const end = formatDateToUs(getEndOfMonth(currentDate));

    const mohMedicines = await getMohMedicineFilter(medicines);
    const medDays = await fetchMigraineAmount(start, end, { medicines: mohMedicines });
    setMedDaysCount(medDays);
  }, [currentDate, medicines]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void collectMedDays();
  }, [collectMedDays]);

  return {
    medDaysCount,
    maxMedDaysCount,
    collectMedDays,
  };
}
