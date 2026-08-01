import { TIME_FRAME_UNITS } from '@/shared/constants/chart-cards/cards';
import type { DropdownOption } from '@/shared/types/input';

export const TIME_FRAME_UNIT_OPTIONS: DropdownOption[] = [
	{ label: 'Days', value: TIME_FRAME_UNITS.DAYS },
	{ label: 'Months', value: TIME_FRAME_UNITS.MONTHS },
];
