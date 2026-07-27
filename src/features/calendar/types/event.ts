import type { StrengthKey } from '@/features/calendar/constants/calendar';
import type { IntensityType, SymptomType } from '@/shared/constants/event/event-details';

export type DatedEvent = {
	date: Date;
};

export type DescriptionEffectiveness = 'yes' | 'no' | '';

export type MigraineDescription = {
	duration: {
		start: number;
		end: number;
	}[];
	intensity: IntensityType;
	symptoms: SymptomType[];
	medicine: string;
	effectiveness: DescriptionEffectiveness[];
	midas: {
		workMissed: boolean;
		workImpaired: boolean;
		choresMissed: boolean;
		choresImpaired: boolean;
		socialMissed: boolean;
	};
};

export type MigraineEvent = {
	date: Date;
	description: MigraineDescription;
	strength: StrengthKey;
};

export type ProphylaxisDescription = {
	medication: string;
	dose: string;
};

export type ProphylaxisEvent = {
	date: Date;
	description: ProphylaxisDescription;
	recurrence: string[] | null;
};
