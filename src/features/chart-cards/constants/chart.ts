import { CHART_TYPES } from '@/shared/constants/chart-cards/charts';
import type { DropdownOption } from '@/shared/types/input';

export const CHART_OPTIONS: DropdownOption[] = [
	{ label: 'Area Chart', value: CHART_TYPES.AREA },
	{ label: 'Pie Chart', value: CHART_TYPES.PIE },
];
