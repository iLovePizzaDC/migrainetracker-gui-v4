import { fetchMigraineAmount } from "@/shared/api/migraine.api";
import { useUser } from "@/shared/hooks/user/use-user";
import { formatDateToUs, getEndOfMonth, getStartOfMonth } from "@/shared/utils/date/date";
import { getMohMedicineFilter } from "@/shared/utils/fetch-helper";
import { useEffect, useState } from "react";

export function useMedDays(currentDate: Date, refetchEvents: () => Promise<void>) {
    const { user } = useUser();

    const [medDaysCount, setMedDaysCount] = useState(0);
    const [maxMedDaysCount] = useState(10); // TODO calculate dynamically (10 with mixed use, 15 without)

    useEffect(() => {
        const collectMedDays = async () => {
            if (!user) return;

            const start = formatDateToUs(getStartOfMonth(currentDate));
            const end = formatDateToUs(getEndOfMonth(currentDate));

            const medicines = await getMohMedicineFilter(user.id);
            const medDays = await fetchMigraineAmount(start, end, { medicines });
            setMedDaysCount(medDays);
        };

        collectMedDays();
    }, [user, currentDate, refetchEvents]);

    return {
        medDaysCount, maxMedDaysCount,
    };
}
