import type { IntensityType, SymptomType } from '@/shared/constants/event/event-details';
import type { AppendDuration, AppendMedicine, AppendMidas } from '@/shared/types/calendar/calendar';

export type Entry = {
	durations: AppendDuration[];
	intensity: IntensityType;
	symptoms: SymptomType[];
	medicines: AppendMedicine[];
	midas: AppendMidas;
};

export type StoredEntry = Entry & {
	date: Date;
};
