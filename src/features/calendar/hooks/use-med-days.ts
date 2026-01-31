import { fetchMigraineAmount } from "@/shared/api/migraine.api";
import { formatDateToUs, getEndOfMonth, getStartOfMonth } from "@/shared/utils/date/date";
import { getMohMedicineFilter } from "@/shared/utils/fetch-helper";
import { useCallback, useEffect, useState } from "react";

export function useMedDays(currentDate: Date) {
    const [medDaysCount, setMedDaysCount] = useState(0);
    const [maxMedDaysCount] = useState(10); // TODO calculate dynamically (10 with mixed use, 15 without)

    const collectMedDays = useCallback(async () => {
        const start = formatDateToUs(getStartOfMonth(currentDate));
        const end = formatDateToUs(getEndOfMonth(currentDate));

        const medicines = await getMohMedicineFilter();
        const medDays = await fetchMigraineAmount(start, end, { medicines });
        setMedDaysCount(medDays);
    }, [currentDate]);

    useEffect(() => {
        const run = () => {
            collectMedDays();
        }

        run();
    }, [collectMedDays]);

    return {
        medDaysCount, maxMedDaysCount,
        collectMedDays,
    };
}
