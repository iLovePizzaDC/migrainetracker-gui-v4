import { TIME_FRAME_UNITS } from '@/shared/constants/chart-cards/cards';
import type { TimeFrameUnit } from '@/shared/types/card';
import {
	formatDateToUs,
	getDateBeforeDays,
	getDateBeforeMonths,
	getDayDifference,
} from '@/shared/utils/date';

export function getDateRange(count: number, unit: TimeFrameUnit) {
	const start =
		unit === TIME_FRAME_UNITS.DAYS
			? getDateBeforeDays(new Date(), count)
			: getDateBeforeMonths(new Date(), count);

	const end =
		unit === TIME_FRAME_UNITS.DAYS
			? getDateBeforeDays(new Date(), 1)
			: getDateBeforeMonths(new Date(), 1);

	const startDate = formatDateToUs(start);
	const endDate = formatDateToUs(end);
	const totalDays = getDayDifference(new Date(startDate), new Date(endDate));

	return { startDate, endDate, totalDays };
}
