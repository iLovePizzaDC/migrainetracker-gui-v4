import type { StrengthKey } from '@/features/calendar/constants/calendar';
import type { SymptomType } from '@/shared/constants/event/event-details';

export type DescriptionEffectiveness = 'yes' | 'no' | '';

export type EventDescription = {
	duration: {
		start: number;
		end: number;
	}[];
	intensity: 'very-high' | 'high' | 'medium' | 'low';
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

export type Event = {
	date: Date;
	description: EventDescription;
	strength: StrengthKey;
};
