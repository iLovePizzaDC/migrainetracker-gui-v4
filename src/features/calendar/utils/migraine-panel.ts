import type { Entry } from '@/features/calendar/types/calendar';
import { DEFAULT_DURATION, DEFAULT_MIDAS } from '@/features/calendar/constants/calendar';
import { INTENSITY_TYPES, SYMPTOM_TYPES } from '@/shared/constants/event/event-details';

export function getInitialFormState(prefilled?: Entry | null): Entry {
	if (prefilled) {
		return {
			durations: prefilled.durations,
			intensity: prefilled.intensity,
			symptoms: prefilled.symptoms,
			medicines: prefilled.medicines,
			midas: prefilled.midas,
		};
	}

	return {
		durations: [DEFAULT_DURATION],
		intensity: INTENSITY_TYPES.MEDIUM,
		symptoms: [SYMPTOM_TYPES.NOISE, SYMPTOM_TYPES.LIGHT],
		medicines: [],
		midas: DEFAULT_MIDAS,
	};
}
