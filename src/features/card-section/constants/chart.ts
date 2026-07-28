import type { DropdownOption } from '@/shared/types/input';
import { CHART_TYPES } from '@/features/card-section/constants/card';

export const CHART_OPTIONS: DropdownOption[] = [
	{ label: 'Area Chart', value: CHART_TYPES.AREA },
	{ label: 'Pie Chart', value: CHART_TYPES.PIE },
];
